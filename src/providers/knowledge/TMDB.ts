import SearchModel from "src/models/SearchModel";
import FullMovieModel from "../../models/FullMovieModel";
import ShortMovieModel from "../../models/ShortMovieModel";
import PaginationModel from "../../models/PaginationModel";
import KnowledgeProvider from "../KnowledgeProvider";
import { MovieCategory } from "../MovieCategory";

export default class TMDB implements KnowledgeProvider
{
	private static locale: string = 'ru-RU';//'en-US';
	private static apiKey: string = '3735813b72994d73278ea217e6a50dd0';
	private genres: any = {};

	constructor()
	{
		this.loadGenres();
	}

	private async loadGenres()
	{
		const movies = this.loadGenre('movie');
		const tvs = this.loadGenre('tv');
		await Promise.all([movies, tvs]);
	}

	private async loadGenre(media_type: 'movie' | 'tv')
	{
		const url: string = `https://api.themoviedb.org/3/genre/${media_type}/list?api_key=${TMDB.apiKey}&language=${TMDB.locale}`;
		return TMDB.getJson<{ genres: { id: number, name: string }[] }>(url)
			.then((result) =>
			{
				this.genres[media_type] = result.genres;
			});
	}

	public getCategories(): MovieCategory[]
	{
		return [
			MovieCategory.Film,
			MovieCategory.Series,
			MovieCategory.Cartoon,
			MovieCategory.AnimatedSeries
		];
	}

	async getCategory(category: MovieCategory): Promise<PaginationModel<ShortMovieModel>>
	{
		if (this.getCategories().indexOf(category) < 0)
		{
			return {
				results: [],
				total_pages: 0,
				total_results: 0,
				page: 0
			}
		}

		let url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB.apiKey}&language=${TMDB.locale}`;
		let media_type:'tv'|'movie' = 'movie';
		if (category == MovieCategory.Film)
		{
			url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB.apiKey}&language=${TMDB.locale}&without_genres=16`;
			media_type = 'movie';
		}
		else if (category == MovieCategory.Cartoon)
		{
			url = `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB.apiKey}&language=${TMDB.locale}&with_genres=16`;
			media_type = 'movie';
		}
		else if (category == MovieCategory.AnimatedSeries)
		{
			url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB.apiKey}&language=${TMDB.locale}&with_genres=16`;
			media_type = 'tv';
		}
		else if (category == MovieCategory.Series)
		{
			url = `https://api.themoviedb.org/3/discover/tv?api_key=${TMDB.apiKey}&language=${TMDB.locale}&without_genres=16`;
			media_type = 'tv';
		}

		return TMDB.getJson<PaginationModel<ShortMovieModel>>(url)
			.then((movies: PaginationModel<ShortMovieModel>) =>
			{
				movies.results = movies.results.map((m: ShortMovieModel) =>
				{
					m.media_type = media_type
					return this.mapToListModel(m);
				});
				movies.results = TMDB.setFullImagePaths(movies.results);
				return movies;
			});
	}

	async search(model: SearchModel): Promise<PaginationModel<ShortMovieModel>>
	{
		const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB.apiKey}&language=${TMDB.locale}&query=${model.text}&page=1&include_adult=false`

		return TMDB.getJson<PaginationModel<any>>(url)
			.then((cards: PaginationModel<any>) =>
			{
				cards.results = cards.results.map((card) =>
				{
					return this.mapToListModel(card);
				}).filter((card) => card);
				return cards;
			})
			.then((cards: PaginationModel<ShortMovieModel>) =>
			{
				cards.results = TMDB.setFullImagePaths(cards.results);
				return cards;
			});
	}

	async getDetails(listModel: ShortMovieModel): Promise<FullMovieModel>
	{
		const url: string = `https://api.themoviedb.org/3/${listModel.media_type}/${listModel.id}?api_key=${TMDB.apiKey}&language=${TMDB.locale}&append_to_response=external_ids,recommendations`;
		return TMDB.getJson<any>(url)
			.then((model: any) =>
			{
				model.media_type = listModel.media_type;
				return this.mapToDetails(model);
			})
			.then((movie: FullMovieModel) =>
			{
				if (movie.poster_path)
				{
					movie.poster_path = TMDB.getPosterFullUrl(movie.poster_path);
				}
				if (movie.backdrop_path)
				{
					movie.backdrop_path = TMDB.getBackdropFullUrl(movie.backdrop_path);
				}
				movie.recommendations.results = TMDB.setFullImagePaths(movie.recommendations.results);
				return movie;
			});
	}

	private static async getJson<TData>(url: string): Promise<TData>
	{
		const headers: HeadersInit = {
			'Accept': '*/*',
			'Connection': 'keep-alive',
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:90.0) Gecko/20100101 Firefox/90.0'
		};

		return await fetch(url, {
			headers: headers
		}).then((response: Response) =>
		{
			return response.json();
		});
	}

	private static setFullImagePaths(movies: ShortMovieModel[]): ShortMovieModel[]
	{
		return movies.map((el: ShortMovieModel) =>
		{
			if (el.poster_path)
			{
				el.poster_path = TMDB.getPosterFullUrl(el.poster_path);
			}
			if (el.backdrop_path)
			{
				el.backdrop_path = TMDB.getBackdropFullUrl(el.backdrop_path);
			}
			return el;
		});
	}

	private static getPosterFullUrl(shortUrl: string, size: 'w342' | 'original' = 'w342'): string
	{
		return `https://image.tmdb.org/t/p/${size}${shortUrl}`;
	}

	private static getBackdropFullUrl(shortUrl: string, size: 'w780' | 'w1280' | 'original' = 'w1280'): string
	{
		return `https://image.tmdb.org/t/p/${size}${shortUrl}`;
	}

	private mapToDetails(model: any): FullMovieModel
	{
		if (model.media_type != 'tv' && model.media_type != 'movie')
			return null;

		var result: FullMovieModel = model;
		if (model.media_type == 'tv')
		{
			result.title = model.name;
			result.original_title = model.original_name;
			result.release_date = model.first_air_date;
			if (!result.imdb_id)
			{
				result.imdb_id = model.external_ids.imdb_id;
			}
			if (model.episode_run_time.length > 0)
			{
				result.runtime = Math.max(...model.episode_run_time);
			}
		}

		model.recommendations.results = model.recommendations.results
			.map(rec => this.mapToListModel(rec));

		return result;
	}

	private mapToListModel(model: any): ShortMovieModel
	{
		if (model.media_type != 'tv' && model.media_type != 'movie')
			return null;

		var result: ShortMovieModel = model;
		if (model.genre_ids && this.genres[model.media_type])
		{
			result.genres = model.genre_ids.map((gid) =>
			{
				return this.genres[model.media_type]
					.filter(e => e.id == gid)[0];
			});
		}

		if (model.media_type == 'tv')
		{
			result.title = model.name;
			result.original_title = model.original_name;
			result.release_date = model.first_air_date;
		}
		return result;
	}
}
