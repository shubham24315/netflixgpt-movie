import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IMG_CDN_URL } from "../utils/constants";
import {
  toggleGptProviderFilter,
  clearGptProviderFilters,
  toggleGptGenreFilter,
  clearGptGenreFilters,
} from "../utils/gptSlice";

/** Show facets only when count is between 25% and 75% of unique results (inclusive). */
const COVERAGE_MIN = 0.25;
const COVERAGE_MAX = 0.75;

export function filterFacetsByResultShare(facets, totalResults) {
  if (!Array.isArray(facets) || totalResults <= 0) return [];
  return facets.filter((f) => {
    const n = f.count ?? 0;
    const share = n / totalResults;
    return share >= COVERAGE_MIN && share <= COVERAGE_MAX;
  });
}

/** Include selected facets so users can always toggle them off even if share is outside range. */
function mergeSelectedFacets(visible, all, selectedIds, getId) {
  if (!all?.length || !selectedIds?.length) return visible;
  const seen = new Set(visible.map((f) => getId(f)));
  const extra = all.filter(
    (f) => selectedIds.includes(getId(f)) && !seen.has(getId(f)),
  );
  return extra.length ? [...visible, ...extra] : visible;
}

function ChevronIcon({ open }) {
  return (
    <svg
      className={`ml-2 h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

const GptFacetDropdowns = () => {
  const dispatch = useDispatch();
  const genreRootRef = useRef(null);
  const [genreOpen, setGenreOpen] = useState(false);

  const {
    providerFacets,
    genreFacets,
    selectedProviderIds,
    selectedGenreIds,
    mergedMovies,
  } = useSelector((store) => store.gpt);

  const totalResults = mergedMovies?.length ?? 0;

  const visibleGenreFacets = useMemo(() => {
    const base = filterFacetsByResultShare(genreFacets || [], totalResults);
    return mergeSelectedFacets(
      base,
      genreFacets,
      selectedGenreIds,
      (f) => f.genre_id,
    );
  }, [genreFacets, totalResults, selectedGenreIds]);

  const visibleProviderFacets = useMemo(() => {
    const base = filterFacetsByResultShare(providerFacets || [], totalResults);
    return mergeSelectedFacets(
      base,
      providerFacets,
      selectedProviderIds,
      (f) => f.provider_id,
    );
  }, [providerFacets, totalResults, selectedProviderIds]);

  useEffect(() => {
    if (!genreOpen) return;
    const close = (e) => {
      if (e.key === "Escape") setGenreOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [genreOpen]);

  useEffect(() => {
    if (!genreOpen) return;
    const onPointerDown = (e) => {
      if (
        genreRootRef.current &&
        !genreRootRef.current.contains(e.target)
      ) {
        setGenreOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [genreOpen]);

  const showGenres = visibleGenreFacets.length > 0;
  const showProviders = visibleProviderFacets.length > 0;

  if (!showGenres && !showProviders) return null;

  return (
    <div className="mb-6 flex flex-row flex-nowrap items-center gap-3 px-2">
      {showGenres ? (
        <div
          ref={genreRootRef}
          className="relative w-[min(100%,13rem)] shrink-0 sm:w-auto sm:min-w-[12.5rem]"
        >
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={genreOpen}
            className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-black/50 px-3 py-2.5 text-left text-sm font-medium text-white shadow-inner transition-colors hover:border-white/25 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            onClick={() => setGenreOpen((o) => !o)}
          >
            <span className="truncate">
              Genres
              {selectedGenreIds.length > 0 ? (
                <span className="ml-1.5 rounded-md bg-white/15 px-1.5 py-0.5 text-xs font-normal tabular-nums text-neutral-200">
                  {selectedGenreIds.length}
                </span>
              ) : null}
            </span>
            <ChevronIcon open={genreOpen} />
          </button>
          {genreOpen ? (
            <div
              className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-neutral-950 py-1 shadow-2xl ring-1 ring-black/40 sm:right-auto sm:min-w-[14rem]"
              role="listbox"
              aria-multiselectable="true"
            >
              {selectedGenreIds.length > 0 ? (
                <div className="sticky top-0 border-b border-white/10 bg-neutral-950/95 px-2 py-1.5 backdrop-blur-sm">
                  <button
                    type="button"
                    className="text-xs font-medium text-red-400 transition-colors hover:text-red-300"
                    onClick={() => dispatch(clearGptGenreFilters())}
                  >
                    Clear all genres
                  </button>
                </div>
              ) : null}
              {visibleGenreFacets.map((f) => {
                const checked = selectedGenreIds.includes(f.genre_id);
                return (
                  <label
                    key={f.genre_id}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-white/10"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/30 bg-black/50 text-violet-500 focus:ring-violet-500/50"
                      checked={checked}
                      onChange={() =>
                        dispatch(toggleGptGenreFilter(f.genre_id))
                      }
                    />
                    <span className="min-w-0 flex-1 truncate">
                      {f.genre_name}
                    </span>
                    <span className="shrink-0 tabular-nums text-xs text-neutral-500">
                      {f.count}
                    </span>
                  </label>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : null}

      {showProviders ? (
        <div className="flex min-h-[2.75rem] min-w-0 flex-1 items-center gap-2">
          {selectedProviderIds.length > 0 ? (
            <button
              type="button"
              className="shrink-0 text-xs whitespace-nowrap text-red-400 transition-colors hover:text-red-300 hover:underline"
              onClick={() => dispatch(clearGptProviderFilters())}
            >
              Clear
            </button>
          ) : null}
          <div className="movie-row flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto pb-1">
            {visibleProviderFacets.map((f) => {
              const active = selectedProviderIds.includes(f.provider_id);
              return (
                <button
                  key={f.provider_id}
                  type="button"
                  onClick={() =>
                    dispatch(toggleGptProviderFilter(f.provider_id))
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 ease-out active:scale-[0.97] ${
                    active
                      ? "border-accent bg-red-950/60 text-white shadow-md shadow-red-900/20"
                      : "border-gray-600/80 bg-gray-900/70 text-gray-200 hover:border-gray-400 hover:bg-gray-800/80"
                  }`}
                >
                  {f.logo_path ? (
                    <img
                      src={`${IMG_CDN_URL}${f.logo_path}`}
                      alt=""
                      className="h-6 w-6 rounded object-contain bg-black/40"
                    />
                  ) : null}
                  <span>{f.provider_name}</span>
                  <span className="text-xs text-gray-500">({f.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GptFacetDropdowns;
