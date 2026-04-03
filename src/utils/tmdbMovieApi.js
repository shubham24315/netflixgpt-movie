import { API_OPTIONS, TMDB_WATCH_REGION } from "./constants";

const PROVIDER_TYPES = [
  { key: "flatrate", label: "Stream" },
  { key: "rent", label: "Rent" },
  { key: "buy", label: "Buy" },
];

/**
 * @param {string|number} movieId
 * @returns {Promise<object|null>}
 */
export async function fetchMovieDetails(movieId) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
    API_OPTIONS,
  );
  if (!res.ok) return null;
  return res.json();
}

/**
 * @param {string|number} movieId
 * @returns {Promise<{ results: object[] }|null>}
 */
export async function fetchMovieReviews(movieId, page = 1) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-US&page=${page}`,
    API_OPTIONS,
  );
  if (!res.ok) return null;
  return res.json();
}

/**
 * Build regional streaming groups + TMDB "where to watch" page URL.
 * @param {object|null} watchJson - response from /movie/{id}/watch/providers
 * @param {string} [region]
 */
export function extractStreamingOfferings(watchJson, region = TMDB_WATCH_REGION) {
  const regional = watchJson?.results?.[region];
  if (!regional) {
    return {
      tmdbWatchUrl: null,
      groups: [],
    };
  }

  const tmdbWatchUrl = typeof regional.link === "string" ? regional.link : null;
  const groups = [];

  for (const { key, label } of PROVIDER_TYPES) {
    const list = regional[key];
    if (!Array.isArray(list) || !list.length) continue;

    const seen = new Set();
    const providers = [];
    for (const p of list) {
      if (p?.provider_id == null || seen.has(p.provider_id)) continue;
      seen.add(p.provider_id);
      providers.push({
        provider_id: p.provider_id,
        provider_name: p.provider_name || `Provider ${p.provider_id}`,
        logo_path: p.logo_path ?? null,
      });
    }
    if (providers.length) {
      groups.push({ type: key, label, providers });
    }
  }

  return { tmdbWatchUrl, groups };
}

/**
 * Search URL so the user can open a provider in their browser (TMDB does not expose deep links per service).
 * @param {string} movieTitle
 * @param {string} providerName
 */
export function buildProviderWatchSearchUrl(movieTitle, providerName) {
  const q = `watch ${movieTitle} on ${providerName}`.trim();
  return `https://www.google.com/search?q=${encodeURIComponent(q)}`;
}
