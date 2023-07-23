import LRU from "lru-cache";

const repoCache = new LRU({
  maxAge: 1000 * 60 * 10,
});

export function cache(repo) {
  const full_name = repo.full_name;
  repoCache.set(full_name, repo);
}

export function get(fullName) {
  return repoCache.get(fullName);
}

export function cacheArray(repos) {
  repos.forEach((repo) => cache(repo));
}
