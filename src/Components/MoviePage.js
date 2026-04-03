import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMovieDetailPage } from "../hooks/useMovieDetailPage";
import {
  IMG_CDN_URL,
  TMDB_WATCH_REGION,
} from "../utils/constants";
import {
  buildProviderWatchSearchUrl,
} from "../utils/tmdbMovieApi";

const BACKDROP = "https://image.tmdb.org/t/p/w1280";
const POSTER = "https://image.tmdb.org/t/p/w500";

function RatingSummary({ value, voteCount, max = 10 }) {
  if (value == null || typeof value !== "number") return null;
  return (
    <div className="flex flex-wrap items-baseline gap-3">
      <p className="text-3xl font-bold tabular-nums text-amber-400">
        {value.toFixed(1)}
        <span className="text-lg font-normal text-neutral-500">/{max}</span>
      </p>
      {voteCount != null ? (
        <span className="text-sm text-neutral-400">
          {Number(voteCount).toLocaleString()} votes
        </span>
      ) : null}
    </div>
  );
}

const MoviePage = () => {
  const { movieId: rawId } = useParams();
  const navigate = useNavigate();
  const { loading, error, detail, reviews, streaming, movieId } =
    useMovieDetailPage(rawId);

  if (loading) {
    return (
      <div className="min-h-[60vh] px-6 py-16 text-center text-neutral-400">
        Loading…
      </div>
    );
  }

  if (error === "invalid_id" || error === "not_found") {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center text-white">
        <h1 className="text-2xl font-semibold">
          {error === "invalid_id" ? "Invalid movie" : "Movie not found"}
        </h1>
        <p className="mt-3 text-neutral-400">
          This title could not be loaded from TMDB.
        </p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-8 rounded-md bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
        >
          Go back
        </button>
        <Link
          to="/Browse"
          className="mt-4 block text-sm text-violet-400 hover:text-violet-300"
        >
          Browse home
        </Link>
      </div>
    );
  }

  if (error === "fetch_failed" || !detail) {
    return (
      <div className="px-6 py-16 text-center text-neutral-300">
        Something went wrong loading this page.
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-6 block w-full max-w-xs mx-auto rounded-md bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
        >
          Go back
        </button>
      </div>
    );
  }

  const title = detail.title || detail.original_title || "Untitled";
  const year = detail.release_date
    ? String(detail.release_date).slice(0, 4)
    : null;
  const backdropUrl = detail.backdrop_path
    ? `${BACKDROP}${detail.backdrop_path}`
    : null;
  const posterUrl = detail.poster_path
    ? `${POSTER}${detail.poster_path}`
    : null;
  const voteAvg = detail.vote_average;
  const voteCount = detail.vote_count;

  return (
    <div className="pb-20 text-white">
      <div className="relative min-h-[42vh] w-full overflow-hidden bg-neutral-900 sm:min-h-[48vh]">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="relative z-[1] mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-10 pt-6 sm:flex-row sm:items-end sm:px-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 z-20 rounded-md bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-black/70 sm:left-8"
          >
            ← Back
          </button>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={`${title} poster`}
              className="mx-auto w-44 shrink-0 rounded-lg shadow-2xl ring-1 ring-white/10 sm:mx-0 sm:w-52"
            />
          ) : (
            <div className="mx-auto h-64 w-44 shrink-0 rounded-lg bg-white/5 ring-1 ring-white/10 sm:mx-0 sm:w-52" />
          )}
          <div className="flex-1 space-y-3 pb-2 sm:pb-6">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {title}
              {year ? (
                <span className="ml-2 text-2xl font-normal text-neutral-400 sm:text-3xl">
                  ({year})
                </span>
              ) : null}
            </h1>
            {detail.tagline ? (
              <p className="text-lg italic text-neutral-300">{detail.tagline}</p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300">
              {detail.runtime ? (
                <span>{detail.runtime} min</span>
              ) : null}
              {Array.isArray(detail.genres) && detail.genres.length ? (
                <span className="text-neutral-500">·</span>
              ) : null}
              {Array.isArray(detail.genres)
                ? detail.genres.map((g) => (
                    <span
                      key={g.id}
                      className="rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5 text-xs text-neutral-200"
                    >
                      {g.name}
                    </span>
                  ))
                : null}
            </div>
            <RatingSummary value={voteAvg} voteCount={voteCount} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-6 sm:px-8">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-white">Overview</h2>
          <p className="max-w-3xl leading-relaxed text-neutral-300">
            {detail.overview || "No description available."}
          </p>
          {detail.homepage ? (
            <a
              href={detail.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300"
            >
              Official site ↗
            </a>
          ) : null}
        </section>

        <section>
          <h2 className="mb-1 text-xl font-semibold text-white">
            Where to watch
          </h2>
          <p className="mb-4 text-sm text-neutral-500">
            Region: {TMDB_WATCH_REGION}. Links open search or TMDB so you can
            open the right app.
          </p>
          {streaming.tmdbWatchUrl ? (
            <a
              href={streaming.tmdbWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-6 inline-block rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition-colors hover:bg-accent-hover"
            >
              View availability on TMDB ↗
            </a>
          ) : null}

          {streaming.groups.length === 0 && !streaming.tmdbWatchUrl ? (
            <p className="text-neutral-500">
              No streaming data for this region in TMDB.
            </p>
          ) : null}

          <div className="space-y-8">
            {streaming.groups.map((group) => (
              <div key={group.type}>
                <h3 className="mb-3 text-sm font-medium uppercase tracking-wide text-neutral-400">
                  {group.label}
                </h3>
                <ul className="flex flex-wrap gap-3">
                  {group.providers.map((p) => {
                    const href = buildProviderWatchSearchUrl(
                      title,
                      p.provider_name,
                    );
                    const logo = p.logo_path
                      ? `${IMG_CDN_URL}${p.logo_path}`
                      : null;
                    return (
                      <li key={p.provider_id}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-neutral-100 transition-all hover:border-white/30 hover:bg-white/10"
                        >
                          {logo ? (
                            <img
                              src={logo}
                              alt=""
                              className="h-8 w-8 rounded object-contain"
                            />
                          ) : null}
                          <span>{p.provider_name}</span>
                          <span className="text-neutral-500">↗</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="text-neutral-500">No published reviews on TMDB yet.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.slice(0, 12).map((r) => {
                const author = r.author || "Anonymous";
                const rating = r.author_details?.rating;
                const avatar = r.author_details?.avatar_path
                  ? r.author_details.avatar_path.startsWith("/http")
                    ? r.author_details.avatar_path.slice(1)
                    : `https://image.tmdb.org/t/p/w64${r.author_details.avatar_path}`
                  : null;
                const excerpt =
                  r.content && r.content.length > 500
                    ? `${r.content.slice(0, 500)}…`
                    : r.content;
                return (
                  <li
                    key={`${r.id ?? author}-${r.created_at}`}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-start gap-3">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt=""
                          className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                        />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-neutral-300">
                          {author.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="font-semibold text-white">
                            {author}
                          </span>
                          {rating != null ? (
                            <span className="text-sm text-amber-400">
                              {rating}/10
                            </span>
                          ) : null}
                          {r.created_at ? (
                            <span className="text-xs text-neutral-500">
                              {new Date(r.created_at).toLocaleDateString()}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-neutral-300">
                          {excerpt}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <p className="text-center text-xs text-neutral-600">
          Movie #{movieId} · Data from{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-400"
          >
            TMDB
          </a>
        </p>
      </div>
    </div>
  );
};

export default MoviePage;
