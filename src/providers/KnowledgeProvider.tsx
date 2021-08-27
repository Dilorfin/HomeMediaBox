import DetailsModel from "../models/DetailsModel";
import ListModel from "../models/ListModel";
import PaginationModel from "../models/PaginationModel";

export default interface KnowledgeProvider
{
	search(text :string) :Promise<PaginationModel<ListModel[]>>;

	getPopularMovie() :Promise<PaginationModel<ListModel[]>>

	getDetails(id :ListModel) :Promise<DetailsModel>;
};