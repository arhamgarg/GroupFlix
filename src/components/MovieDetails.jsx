import React from "react";

const MovieDetails = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-dark-100 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-6 flex-col md:flex-row">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
                : "no-movie.png"
            }
            alt={movie.title}
            className="w-full md:w-1/3 h-auto rounded-lg"
          />

          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300">
                {movie.overview || "No overview available."}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <img src="star.svg" alt="Rating" className="w-4 h-4" />
                  <span className="text-white">
                    {movie.vote_average?.toFixed(1) || "N/A"}
                  </span>
                </div>

                <div className="text-gray-400">
                  Release Year: {movie.release_date.split("-")[0] || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
