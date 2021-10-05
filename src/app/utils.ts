declare global
{
	interface Array<T>
	{
		filterUnique(getValue?: any): Array<T>;
	}
}

export default class Utils
{
	static extendDefaultPrototypes()
	{
		Array.prototype.filterUnique = function <T>(getValue?: (value: T) => any): T[]
		{
			if (!getValue) getValue = (v: T) => v;

			return this.filter((value: T, index: number) => index == this.findIndex((el: T) => getValue(el) == getValue(value)))
				.filter((value: T) => value != null);
		}
	}
} 1