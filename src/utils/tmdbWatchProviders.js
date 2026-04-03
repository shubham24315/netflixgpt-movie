import { API_OPTIONS, TMDB_WATCH_REGION } from "./constants";

const PROVIDER_CATEGORIES = ["flatrate", "rent", "buy"];

export async function fetchMovieWatchProviders(movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
    API_OPTIONS,
  );
  if (!res.ok) return null;
  return res.json();
}

export function extractProvidersFromRegionalData(
  watchProvidersResponse,
  region = TMDB_WATCH_REGION,
) {
  const idSet = new Set();
  const providerDetails = {};

  const regional = watchProvidersResponse?.results?.[region];
  if (!regional) {
    return { ids: [], providerDetails };
  }

  for (const cat of PROVIDER_CATEGORIES) {
    const list = regional[cat];
    if (!Array.isArray(list)) continue;
    for (const p of list) {
      if (p?.provider_id == null) continue;
      if (!idSet.has(p.provider_id)) {
        idSet.add(p.provider_id);
        providerDetails[p.provider_id] = {
          provider_name: p.provider_name,
          logo_path: p.logo_path,
        };
      }
    }
  }

  return { ids: Array.from(idSet), providerDetails };
}

export function enrichMovieLists(movieResults, providersByMovieId) {
  if (!Array.isArray(movieResults)) return movieResults;
  return movieResults.map((row) =>
    (row || []).map((movie) => {
      if (!movie?.id) {
        return { ...movie, provider_ids: [] };
      }
      const provider_ids = providersByMovieId[movie.id] ?? [];
      return { ...movie, provider_ids };
    }),
  );
}

export function buildProviderFacets(enrichedMovieResults, providerMeta = {}) {
  const contribution = new Map();

  for (const row of enrichedMovieResults || []) {
    for (const movie of row || []) {
      if (!movie?.id) continue;
      for (const pid of movie.provider_ids || []) {
        if (!contribution.has(pid)) contribution.set(pid, new Set());
        contribution.get(pid).add(movie.id);
      }
    }
  }

  const facets = [];
  for (const [provider_id, movieIdSet] of contribution) {
    const meta = providerMeta[provider_id] || {};
    facets.push({
      provider_id,
      provider_name: meta.provider_name || `Provider ${provider_id}`,
      logo_path: meta.logo_path ?? null,
      count: movieIdSet.size,
    });
  }

  facets.sort(
    (a, b) =>
      b.count - a.count || a.provider_name.localeCompare(b.provider_name),
  );
  return facets;
}

export async function collectProvidersForMovies(movieIds, region) {
  const providersByMovieId = {};
  const providerMeta = {};

  await Promise.all(
    movieIds.map(async (id) => {
      try {
        const json = await fetchMovieWatchProviders(id);
        if (!json) {
          providersByMovieId[id] = [];
          return;
        }
        const { ids, providerDetails } = extractProvidersFromRegionalData(
          json,
          region,
        );
        providersByMovieId[id] = ids;
        Object.assign(providerMeta, providerDetails);
      } catch {
        providersByMovieId[id] = [];
      }
    }),
  );

  return { providersByMovieId, providerMeta };
}
