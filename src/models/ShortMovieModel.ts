export default interface ShortMovieModel
{
	id: string;

	media_type: string;

	title: string;
	original_title: string;

	original_language: string;

	overview: string;

	poster_path: string;
	backdrop_path: string;

	genres: { id: number, name: string }[];

	adult: boolean;

	release_date: string;

	popularity: number;

	vote_count: number;
	vote_average: number;
};
