export default interface Pagination<TData>
{
	results:TData;
	page:number;
	total_results:number;
	total_pages:number;
};