using System.Collections.Concurrent;

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

		public static ConcurrentDictionary<TKey, TElement> ToConcurrentDictionary<TSource, TKey, TElement>(this IEnumerable<TSource> values, Func<TSource, TKey> keySelector, Func<TSource, TElement> elementSelector) where TKey : notnull
		{
			var dictionary = new ConcurrentDictionary<TKey, TElement>();
            foreach (var item in values)
            {
				dictionary.TryAdd(keySelector(item), elementSelector(item));
            }
			return dictionary;
        }
	}
}