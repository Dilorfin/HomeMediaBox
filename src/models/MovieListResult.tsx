export default interface MovieListResult
{
	id :string;
	
	title:string;
	original_title:string;

	original_language:string;
	
	overview:string;

	poster_path :string;
	backdrop_path:string;
	
	genre_ids:number[];

	adult:boolean;
	
	release_date:string;

	popularity:number;

	vote_count:number;
	vote_average:number;
}