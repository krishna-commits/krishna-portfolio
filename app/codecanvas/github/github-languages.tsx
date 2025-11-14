// GithubLanguages.js
import React, { useEffect, useState } from 'react';
import { useGetGithubRepoLanguages } from 'app/api/github'; // Replace with the correct path

function GithubLanguages({ repoName }: { repoName: string }) {
  const { language, languageLoading, languageError, languageValidating, languageEmpty } = useGetGithubRepoLanguages({ uid: repoName });

  return (
    <div className="flex">
      {languageLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex gap-3">
          {!languageEmpty && Object.entries(language).map(([lang, count]) => (
            <p className="text-sm dark:text-slate-600 text-slate-900" key={lang}>
              # {lang}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default GithubLanguages;
