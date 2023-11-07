using System.Collections.Concurrent;

namespace PharmacyManager.API.Interfaces.Medicines
{
	public interface IMedicinesState<TKey, TValue> where TKey : notnull
	{
		ConcurrentDictionary<TKey, TValue> Medicines { get; }
	}
}
