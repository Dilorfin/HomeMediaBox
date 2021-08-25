import MovieListResult from "./MovieListResult";
import Pagination from "./Pagination";

export default interface MovieDetails
{
	id :number;
	imdb_id :string;
	
	title :string;
	original_title: string;

	original_language: string;

	backdrop_path :string;
	poster_path :string;

	genres :{id:number,name:string};

	production_countries :{iso_3166_1:string,name:string};

	release_date :string;
	runtime :number;

	adult :boolean;

	vote_average :number;
	vote_count :number;

	status :string;

	recommendations :Pagination<MovieListResult[]>;
};