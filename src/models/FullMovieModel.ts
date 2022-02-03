import ShortMovieModel from "./ShortMovieModel";
import PaginationModel from "./PaginationModel";

export default interface FullMovieModel
{
	id :string;
	imdb_id :string;
	
	media_type :'tv'|'movie';

	title :string;
	original_title: string;

	original_language: string;

	overview: string;

	backdrop_path :string;
	poster_path :string;

	genres :{id:number,name:string}[];

	production_countries :{iso_3166_1:string,name:string}[];

	release_date :string;
	runtime :number;

	adult :boolean;

	vote_average :number;
	vote_count :number;

	status :string;

	recommendations :PaginationModel<ShortMovieModel>;

	number_of_episodes :number|undefined;
	number_of_seasons :number|undefined;

	images: {
		backdrops:{
			height: number,
			width: number,
			
			iso_639_1: string,
			vote_average: number,
			vote_count: number,

			file_path: string
		}[]
	};
};