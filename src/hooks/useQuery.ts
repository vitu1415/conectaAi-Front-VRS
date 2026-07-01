import { useQuery as useReactQuery, useMutation, type QueryKey, type QueryFunction } from '@tanstack/react-query'

export function useQuery<T>(key: QueryKey, fn: QueryFunction<T>) {
  return useReactQuery<T>({ queryKey: key, queryFn: fn })
}

export function useMutate<T, V>(fn: (vars: V) => Promise<T>, invalidateKeys?: QueryKey[]) {
  return useMutation<T, Error, V>({
    mutationFn: fn,
    onSuccess: () => {
      invalidateKeys?.forEach((key) => {
        // Invalidation logic here
      })
    },
  })
}
