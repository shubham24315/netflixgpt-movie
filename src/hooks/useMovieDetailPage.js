import { useEffect, useState } from "react";
import { fetchMovieWatchProviders } from "../utils/tmdbWatchProviders";
import {
  fetchMovieDetails,
  fetchMovieReviews,
  extractStreamingOfferings,
} from "../utils/tmdbMovieApi";

function parseMovieId(raw) {
  if (raw == null || raw === "") return null;
  const n = Number.parseInt(String(raw), 10);
  if (!Number.isInteger(n) || n <= 0) return null;
  return n;
}

/**
 * Loads TMDB movie detail, first page of reviews, and watch providers for the configured region.
 */
export function useMovieDetailPage(movieIdParam) {
  const id = parseMovieId(movieIdParam);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [detail, setDetail] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [streaming, setStreaming] = useState({
    tmdbWatchUrl: null,
    groups: [],
  });

  useEffect(() => {
    if (id == null) {
      setLoading(false);
      setError("invalid_id");
      setDetail(null);
      setReviews([]);
      setStreaming({ tmdbWatchUrl: null, groups: [] });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [movie, reviewsRes, watchJson] = await Promise.all([
          fetchMovieDetails(id),
          fetchMovieReviews(id, 1),
          fetchMovieWatchProviders(id),
        ]);

        if (cancelled) return;

        if (!movie) {
          setError("not_found");
          setDetail(null);
          setReviews([]);
          setStreaming({ tmdbWatchUrl: null, groups: [] });
          return;
        }

        setDetail(movie);
        setReviews(
          Array.isArray(reviewsRes?.results) ? reviewsRes.results : [],
        );
        setStreaming(extractStreamingOfferings(watchJson));
      } catch {
        if (!cancelled) {
          setError("fetch_failed");
          setDetail(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return {
    movieId: id,
    loading,
    error,
    detail,
    reviews,
    streaming,
  };
}
