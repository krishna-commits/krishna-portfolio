import { useMemo } from 'react';
import useSWR from 'swr';
// utils
import { fetcher, endpoints} from './api';
//


// -------------------------------------------------------

export function useGetGithubRepos() {
    const URL = endpoints.repos;
    const { data, isLoading, error, isValidating } = useSWR([URL], fetcher);
    const memoizedValue = useMemo(
        () => ({
          repo : data || [],
          repoLoading: isLoading,
          repoError: error,
          repoValidating: isValidating,
          repoEmpty: !isLoading && data && data.length === 0
        }),
        [data, error, isLoading, isValidating]
      );
      return memoizedValue;
}

export function useGetGithubRepoLanguages({ uid }) {
  const URL = `${endpoints.repolanguages}${uid}/languages`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const languageEmpty = data === undefined || data === null || Object.keys(data).length === 0;
  const memoizedValue = useMemo(
    () => ({
      language: data || {},
      languageLoading: isLoading,
      languageError: error,
      languageValidating: isValidating,
      languageEmpty
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}

export function useGetGithubRepoContributors({ uid }) {
  const URL = `${endpoints.repocontributors}${uid}/contributors`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const contributorsEmpty = data === undefined || data === null ;
  const memoizedValue = useMemo(
    () => ({
      contributors: data || [],
      contributorsLoading: isLoading,
      contributorsError: error,
      contributorsValidating: isValidating,
      contributorsEmpty
    }),
    [data, error, isLoading, isValidating,]
  );
  return memoizedValue;
}


export function useGetMDXFile(url) {
  const { data, error } = useSWR(url, async (url) => {
    const response = await fetch(url);
    const mdxContent = await response.text();
    return mdxContent;
  });

  const memoizedValue = useMemo(
    () => ({
      mdxContent: data || '',
      mdxError: error,
      mdxLoading: !data && !error,
    }),
    [data, error]
  );

  return memoizedValue;
}
