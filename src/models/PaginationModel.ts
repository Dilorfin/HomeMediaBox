export default interface PaginationModel<TData>
{
	results :TData[];
	page :number;
	total_results :number;
	total_pages :number;
};
