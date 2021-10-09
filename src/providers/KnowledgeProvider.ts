import DetailsModel from "src/models/DetailsModel";
import ListModel from "src/models/ListModel";
import PaginationModel from "src/models/PaginationModel";
import { MovieCategory } from "./MovieCategory";

export default interface KnowledgeProvider
{
	search(text: string): Promise<PaginationModel<ListModel>>;

	getDetails(model: ListModel): Promise<DetailsModel>;

	getCategory(filter: MovieCategory): Promise<PaginationModel<ListModel>>

	getCategories(): MovieCategory[];
};
