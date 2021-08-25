import defaults from "../defaults";
import MovieDetails from "../models/MovieDetails";
import MovieListResult from "../models/MovieListResult";
import Pagination from "../models/Pagination";

export default class TMDB {
	private static async getJson<TData>(url:string) :Promise<TData>
	{
		return await fetch(url, {
			headers: defaults.headers
		}).then((response: Response)=>{
			return response.json();
		});
	}

	private static setFullImagePaths(movies :MovieListResult[]) : MovieListResult[]
	{
		return movies.map((el:MovieListResult)=>{
			el.poster_path = TMDB.getImageFullUrl(el.poster_path);
			el.backdrop_path = TMDB.getImageFullUrl(el.backdrop_path);
			return el;
		});
	}

	static async getPopularMovie() :Promise<Pagination<MovieListResult[]>>
	{
		const url = "https://api.themoviedb.org/3/movie/popular?api_key=3735813b72994d73278ea217e6a50dd0&language=en-US&page=1";
		return TMDB.getJson<Pagination<MovieListResult[]>>(url)
			.then((movies :Pagination<MovieListResult[]>)=>{
				movies.results = TMDB.setFullImagePaths(movies.results);
				return movies;
			});
	}

	static async getDetails(id:number) :Promise<MovieDetails>
	{
		const url :string = `https://api.themoviedb.org/3/movie/${id}?api_key=3735813b72994d73278ea217e6a50dd0&language=en-US&append_to_response=recommendations`;
		console.log(url)
		return TMDB.getJson<MovieDetails>(url)
			.then((movie :MovieDetails)=>{
				//TODO: check if empty
				movie.poster_path = TMDB.getImageFullUrl(movie.poster_path);
				movie.backdrop_path = TMDB.getImageFullUrl(movie.backdrop_path);
				movie.recommendations.results = TMDB.setFullImagePaths(movie.recommendations.results);
				return movie;
			});
	}

	static getImageFullUrl(shortUrl:string) :string{
		return "https://image.tmdb.org/t/p/original"+shortUrl;
	}
}