import FullMovieModel from "src/models/FullMovieModel";
import ShortMovieModel from "src/models/ShortMovieModel";
import PaginationModel from "src/models/PaginationModel";
import SearchModel from "src/models/SearchModel";
import { MovieCategory } from "./MovieCategory";

export default interface KnowledgeProvider
{
	search(text: SearchModel): Promise<PaginationModel<ShortMovieModel>>;

	getDetails(model: ShortMovieModel): Promise<FullMovieModel>;

	getCategory(filter: MovieCategory): Promise<PaginationModel<ShortMovieModel>>

	getCategories(): MovieCategory[];
};
