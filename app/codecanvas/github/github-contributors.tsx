import { useGetGithubRepoContributors } from 'app/api/github'; 

function GithubContributors({ repoName }: { repoName: string }) {
  const { contributors, contributorsLoading, contributorsError, contributorsValidating, contributorsEmpty } = useGetGithubRepoContributors({ uid: repoName });

  return (
    <div className="flex">
      {contributorsLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex gap-3">
          {!contributorsEmpty && contributors.map((user: any) => (
            <p className="text-sm dark:text-slate-600 text-slate-900" key={user.id}>
              # {user.login}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default GithubContributors;
