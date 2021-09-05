import DetailsModel from "src/models/DetailsModel";
import ListModel from "src/models/ListModel";
import PaginationModel from "src/models/PaginationModel";

export default interface KnowledgeProvider
{
	search(text :string) :Promise<PaginationModel<ListModel[]>>;

	getPopularMovie() :Promise<PaginationModel<ListModel[]>>

	getDetails(id :ListModel) :Promise<DetailsModel>;
};