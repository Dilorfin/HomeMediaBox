import MovieDetails from "../models/MovieDetails";
import MovieListResult from "../models/MovieListResult";
import Pagination from "../models/Pagination";

export default interface KnowledgeProvider
{
	search(text :string) :Promise<Pagination<MovieListResult[]>>;

	getPopularMovie() :Promise<Pagination<MovieListResult[]>>

	getMovieDetails(id :string) :Promise<MovieDetails>;
};