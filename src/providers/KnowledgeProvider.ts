import DetailsModel from "src/models/DetailsModel";
import ListModel from "src/models/ListModel";
import PaginationModel from "src/models/PaginationModel";
import SearchModel from "src/models/SearchModel";
import { MovieCategory } from "./MovieCategory";

export default interface KnowledgeProvider
{
	search(text: SearchModel): Promise<PaginationModel<ListModel>>;

	getDetails(model: ListModel): Promise<DetailsModel>;

	getCategory(filter: MovieCategory): Promise<PaginationModel<ListModel>>

	getCategories(): MovieCategory[];
};
