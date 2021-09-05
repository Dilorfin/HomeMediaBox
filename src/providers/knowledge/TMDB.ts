import DetailsModel from "../../models/DetailsModel";
import ListModel from "../../models/ListModel";
import PaginationModel from "../../models/PaginationModel";
import KnowledgeProvider from "../KnowledgeProvider";

export default class TMDB implements KnowledgeProvider
{
	private static locale: string = 'ru-RU';//'en-US';
	private static apikey: string = '3735813b72994d73278ea217e6a50dd0';

	async getPopularMovie(): Promise<PaginationModel<ListModel[]>>
	{
		const temp: 'tv' | 'movie' = 'movie';
		const url = `https://api.themoviedb.org/3/${temp}/popular?api_key=${TMDB.apikey}&language=${TMDB.locale}&page=1`;
		return TMDB.getJson<PaginationModel<ListModel[]>>(url)
			.then((movies: PaginationModel<ListModel[]>) =>
			{
				movies.results = movies.results.map((m: ListModel) =>
				{
					//m.media_type = 'movie'
					m.media_type = temp
					return m;
				});
				movies.results = TMDB.setFullImagePaths(movies.results);
				return movies;
			});
	}

	async search(text: string): Promise<PaginationModel<ListModel[]>>
	{
		const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB.apikey}&language=${TMDB.locale}&query=${text}&page=1&include_adult=false`

		return TMDB.getJson<PaginationModel<any[]>>(url)
			.then((cards: PaginationModel<any[]>) =>
			{
				cards.results = cards.results.map(TMDB.mapToListModel)
					.filter((card) => card);
				return cards;
			})
			.then((cards: PaginationModel<ListModel[]>) =>
			{
				cards.results = TMDB.setFullImagePaths(cards.results);
				return cards;
			});
	}

	async getDetails(listModel: ListModel): Promise<DetailsModel>
	{
		const url: string = `https://api.themoviedb.org/3/${listModel.media_type}/${listModel.id}?api_key=${TMDB.apikey}&language=${TMDB.locale}&append_to_response=external_ids,recommendations`;
		return TMDB.getJson<any>(url)
			.then((model: any) =>
			{
				model.media_type = listModel.media_type;
				return TMDB.mapToDetails(model);
			})
			.then((movie: DetailsModel) =>
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
		return await fetch(url, {
			headers: shared.headers
		}).then((response: Response) =>
		{
			return response.json();
		});
	}

	private static setFullImagePaths(movies: ListModel[]): ListModel[]
	{
		return movies.map((el: ListModel) =>
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
		return "https://image.tmdb.org/t/p/" + size + shortUrl;
	}

	private static getBackdropFullUrl(shortUrl: string, size: 'w780' | 'w1280' | 'original' = 'w1280'): string
	{
		return "https://image.tmdb.org/t/p/original" + shortUrl;
	}

	private static mapToDetails(model: any): DetailsModel
	{
		if (model.media_type != 'tv' && model.media_type != 'movie')
			return null;

		var result: DetailsModel = model;
		if (model.media_type == 'tv')
		{
			result.title = model.name;
			result.original_title = model.original_name;
			result.imdb_id = model.external_ids.imdb_id;
			result.release_date = model.first_air_date;
		}
		return result;
	}

	private static mapToListModel(model: any): ListModel
	{
		if (model.media_type != 'tv' && model.media_type != 'movie')
			return null;

		var result: ListModel = model;
		if (model.media_type == 'tv')
		{
			result.title = model.name;
			result.original_title = model.original_name;
			result.release_date = model.first_air_date;
		}
		return result;
	}
}