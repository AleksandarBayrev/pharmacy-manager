namespace PharmacyManager.API.Extensions
{
	public static class EnumerableExtensions
	{
		public static IEnumerable<T> WhereWhen<T>(this IEnumerable<T> source,Func<T, bool> predicate, bool condition, Action? additionalCallback = null)
		{
			if (condition)
			{
				if (additionalCallback != null)
				{
					additionalCallback();
				}
				return source.Where(predicate);
			}
			return source;
		}
	}
}