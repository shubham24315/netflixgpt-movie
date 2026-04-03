import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IMG_CDN_URL } from "../utils/constants";
import {
  toggleGptProviderFilter,
  clearGptProviderFilters,
} from "../utils/gptSlice";

const ProviderTopFilters = () => {
  const dispatch = useDispatch();
  const { providerFacets, selectedProviderIds } = useSelector(
    (store) => store.gpt,
  );

  if (!providerFacets?.length) return null;

  return (
    <div className="mb-6 px-2">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-sm text-gray-400 shrink-0">Watch providers</span>
        {selectedProviderIds.length > 0 && (
          <button
            type="button"
            onClick={() => dispatch(clearGptProviderFilters())}
            className="text-xs text-red-400 hover:underline shrink-0"
          >
            Clear all
          </button>
        )}
      </div>
      <div className="flex flex-wrap sm:flex-nowrap gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {providerFacets.map((f) => {
          const active = selectedProviderIds.includes(f.provider_id);
          return (
            <button
              key={f.provider_id}
              type="button"
              onClick={() => dispatch(toggleGptProviderFilter(f.provider_id))}
              className={`flex items-center gap-2 shrink-0 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "border-red-500 bg-red-950/50 text-white"
                  : "border-gray-600 bg-gray-900/80 text-gray-200 hover:border-gray-400"
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
  );
};

export default ProviderTopFilters;
