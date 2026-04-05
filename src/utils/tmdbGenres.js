/** TMDB movie genre ids → names (stable API vocabulary). */
export const MOVIE_GENRE_NAMES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export function buildGenreFacets(movies) {
  const contribution = new Map();
  for (const movie of movies || []) {
    if (movie?.id == null) continue;
    for (const gid of movie.genre_ids || []) {
      if (gid == null) continue;
      if (!contribution.has(gid)) contribution.set(gid, new Set());
      contribution.get(gid).add(movie.id);
    }
  }

  const facets = [];
  for (const [genre_id, idSet] of contribution) {
    facets.push({
      genre_id,
      genre_name: MOVIE_GENRE_NAMES[genre_id] || `Genre ${genre_id}`,
      count: idSet.size,
    });
  }

  facets.sort(
    (a, b) =>
      b.count - a.count || a.genre_name.localeCompare(b.genre_name),
  );
  return facets;
}
