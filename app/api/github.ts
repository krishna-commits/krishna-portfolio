import { useMemo } from 'react';
import useSWR from 'swr';

// Simple fetcher function for useSWR
const fetcher = async (url: string | string[]) => {
  const urlString = Array.isArray(url) ? url[0] : url;
  const res = await fetch(urlString);
  if (!res.ok) {
    throw new Error('Failed to fetch');
  }
  return res.json();
};


// -------------------------------------------------------

export function useGetGithubRepos() {
    // Use server-side API route that uses GITHUB_ACCESS_TOKEN for better rate limits
    const URL = '/api/github/repos';
    const { data, isLoading, error, isValidating } = useSWR([URL], fetcher);
    
    const memoizedValue = useMemo(
        () => ({
          repo : data?.repos || [],
          repoLoading: isLoading,
          repoError: error,
          repoValidating: isValidating,
          repoEmpty: !isLoading && data && data.repos && data.repos.length === 0,
          authenticated: data?.authenticated || false,
        }),
        [data, error, isLoading, isValidating]
      );
      return memoizedValue;
}

export function useGetGithubRepoLanguages({ uid }) {
  const URL = `https://api.github.com/repos/${uid}/languages`;
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
  const URL = `https://api.github.com/repos/${uid}/contributors`;
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
