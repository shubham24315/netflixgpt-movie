#netflix gpt

-create react app 
-configure tailwind
-Header
-Routing of App
-Login form
-Singup form
- Form valiadation
- Create Signup User Account
- Implement Sign In user Api
- Created Redux Store with userSlice
- Implemented sign out
- BugFix: sign up user displayName 
-BugFix: if the user is not logged in redirect /Browse to /Login and vice versa
- Unsubscribed  to the onAuthstatechaned callback
- Add hardcoded values to the constants file
- register tmdp api & create an app & get acess token
- get  data from tmddb now playing api
-(BONUS) Multi -language Feature in our App
-Integrate our gpt api
#features
-Login/Sign up
 - Sign In/Sign up Form
 - redirect to Browse Page
- Browse(after authentication)
  -Header
  - Main Movie
    -Trailer in Background
    -Title in Description
    -Movie list
      -MovieLists * n
-Netflix GPT
 -Search bar
 -Movie suggestoin

## TMDB watch providers and provider filters

After GPT suggests movie titles, each title is resolved via TMDB `search/movie`. Results are merged into one deduplicated list. Unique movie IDs are enriched with **`GET /3/movie/{id}/watch/providers`**. Provider data for the configured region merges **flatrate** (subscription), **rent**, and **buy** into `provider_ids` on each movie. Provider and genre facets power **dropdown multi-selects** above the results grid. With no options selected, all merged movies show; with selections active, lists filter by **OR** semantics per facet type. Movies with no providers in that region are hidden while provider filters are active.

**Configuration:** set `REACT_APP_TMDB_WATCH_REGION` (ISO country code, e.g. `US`, `IN`). Defaults to `US` if unset. Uses the same `REACT_APP_TMDB_KEY` / `API_OPTIONS` as other TMDB calls.

**Main files:** [`src/utils/tmdbWatchProviders.js`](src/utils/tmdbWatchProviders.js), [`src/utils/tmdbGenres.js`](src/utils/tmdbGenres.js), [`src/utils/gptSlice.js`](src/utils/gptSlice.js), [`src/Components/GptSearchBar.js`](src/Components/GptSearchBar.js), [`src/Components/GptFacetDropdowns.js`](src/Components/GptFacetDropdowns.js), [`src/Components/GptMovieSuggesions.js`](src/Components/GptMovieSuggesions.js).

### Sequence: search → providers → store → UI

```mermaid
sequenceDiagram
  participant Bar as GptSearchBar
  participant TMDB as TMDB_API
  participant Store as gptSlice
  participant UI as GptFacetDropdowns
  participant List as GptMovieSuggesions

  Bar->>TMDB: search/movie per GPT title
  TMDB-->>Bar: movieResults arrays
  Bar->>Bar: unique movie ids, merge rows
  Bar->>TMDB: movie/id/watch/providers per id
  TMDB-->>Bar: providers by region
  Bar->>Bar: attach providerIds, build provider & genre facets
  Bar->>Store: addGptMovieResults merged list plus facets
  Store->>UI: facets, selectedProviderIds, selectedGenreIds
  UI->>Store: toggle filters
  Store->>List: filtered merged movies as grid
```

### Filter behavior (high level)

```mermaid
flowchart LR
  subgraph fetch [After GPT search]
    A[TMDB search results] --> B[Unique movie IDs]
    B --> C[Watch providers API]
    C --> D[Enrich movies with provider_ids]
    D --> E[Build provider facets]
  end
  subgraph ui [User filtering]
    E --> F[Provider & genre dropdowns]
    F --> G{Any filter selected?}
    G -->|No| H[Show all merged movies in grid]
    G -->|Yes| I[Show movies matching facet selections]
  end
```