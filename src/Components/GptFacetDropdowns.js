import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IMG_CDN_URL } from "../utils/constants";
import {
  toggleGptProviderFilter,
  clearGptProviderFilters,
  toggleGptGenreFilter,
  clearGptGenreFilters,
} from "../utils/gptSlice";

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
  const rootRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(null);

  const {
    providerFacets,
    genreFacets,
    selectedProviderIds,
    selectedGenreIds,
  } = useSelector((store) => store.gpt);

  useEffect(() => {
    if (!openMenu) return;
    const close = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [openMenu]);

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [openMenu]);

  const hasProviders = providerFacets?.length > 0;
  const hasGenres = genreFacets?.length > 0;

  if (!hasProviders && !hasGenres) return null;

  return (
    <div
      ref={rootRef}
      className="mb-6 flex flex-col gap-3 px-2 sm:flex-row sm:flex-wrap sm:items-start sm:gap-4"
    >
      {hasProviders ? (
        <div className="relative min-w-[min(100%,14rem)] sm:min-w-[12rem]">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={openMenu === "providers"}
            className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-black/50 px-3 py-2.5 text-left text-sm font-medium text-white shadow-inner transition-colors hover:border-white/25 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-accent/40"
            onClick={() =>
              setOpenMenu((m) => (m === "providers" ? null : "providers"))
            }
          >
            <span className="truncate">
              Watch providers
              {selectedProviderIds.length > 0 ? (
                <span className="ml-1.5 rounded-md bg-white/15 px-1.5 py-0.5 text-xs font-normal tabular-nums text-neutral-200">
                  {selectedProviderIds.length}
                </span>
              ) : null}
            </span>
            <ChevronIcon open={openMenu === "providers"} />
          </button>
          {openMenu === "providers" ? (
            <div
              className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-neutral-950 py-1 shadow-2xl ring-1 ring-black/40 sm:right-auto sm:min-w-[17rem)"
              role="listbox"
              aria-multiselectable="true"
            >
              {selectedProviderIds.length > 0 ? (
                <div className="sticky top-0 border-b border-white/10 bg-neutral-950/95 px-2 py-1.5 backdrop-blur-sm">
                  <button
                    type="button"
                    className="text-xs font-medium text-red-400 transition-colors hover:text-red-300"
                    onClick={() => dispatch(clearGptProviderFilters())}
                  >
                    Clear all providers
                  </button>
                </div>
              ) : null}
              {providerFacets.map((f) => {
                const checked = selectedProviderIds.includes(f.provider_id);
                return (
                  <label
                    key={f.provider_id}
                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-neutral-200 hover:bg-white/10"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/30 bg-black/50 text-accent focus:ring-accent/50"
                      checked={checked}
                      onChange={() =>
                        dispatch(toggleGptProviderFilter(f.provider_id))
                      }
                    />
                    {f.logo_path ? (
                      <img
                        src={`${IMG_CDN_URL}${f.logo_path}`}
                        alt=""
                        className="h-6 w-6 rounded object-contain"
                      />
                    ) : (
                      <span className="h-6 w-6 shrink-0 rounded bg-white/10" />
                    )}
                    <span className="min-w-0 flex-1 truncate">{f.provider_name}</span>
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

      {hasGenres ? (
        <div className="relative min-w-[min(100%,14rem)] sm:min-w-[12rem]">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={openMenu === "genres"}
            className="flex w-full items-center justify-between rounded-lg border border-white/15 bg-black/50 px-3 py-2.5 text-left text-sm font-medium text-white shadow-inner transition-colors hover:border-white/25 hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
            onClick={() =>
              setOpenMenu((m) => (m === "genres" ? null : "genres"))
            }
          >
            <span className="truncate">
              Genres
              {selectedGenreIds.length > 0 ? (
                <span className="ml-1.5 rounded-md bg-white/15 px-1.5 py-0.5 text-xs font-normal tabular-nums text-neutral-200">
                  {selectedGenreIds.length}
                </span>
              ) : null}
            </span>
            <ChevronIcon open={openMenu === "genres"} />
          </button>
          {openMenu === "genres" ? (
            <div
              className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded-lg border border-white/10 bg-neutral-950 py-1 shadow-2xl ring-1 ring-black/40 sm:right-auto sm:min-w-[14rem)"
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
              {genreFacets.map((f) => {
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
                    <span className="min-w-0 flex-1 truncate">{f.genre_name}</span>
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
    </div>
  );
};

export default GptFacetDropdowns;
