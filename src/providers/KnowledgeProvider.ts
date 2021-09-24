import DetailsModel from "src/models/DetailsModel";
import KPFilterModel from "src/models/KPFilterModel";
import ListModel from "src/models/ListModel";
import PaginationModel from "src/models/PaginationModel";

export default interface KnowledgeProvider
{
	search(text: string): Promise<PaginationModel<ListModel[]>>;

	getDetails(model: ListModel): Promise<DetailsModel>;

	getFiltered(filter: KPFilterModel): Promise<PaginationModel<ListModel[]>>

	getFilters(): KPFilterModel[];
};
