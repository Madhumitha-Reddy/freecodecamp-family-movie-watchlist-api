
import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  getWatchlist,
  addMovie,
  updateMovie,
  deleteMovie,
} from "../utils/db.js";

const router = express.Router();

// All watchlist routes require authentication.
router.use(authenticate);

// Get a user's watchlist.
router.get("/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const watchlist = getWatchlist(userId);

  if (watchlist === null) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json(watchlist);
});

// Add a movie to a user's watchlist.
router.post("/:userId/movies", authorizeModification, (req, res) => {
  const userId = Number(req.params.userId);
  const movie = addMovie(userId, req.body || {});

  if (movie === null) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(201).json(movie);
});

// Update a movie in a user's watchlist.
router.put(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);

    const movie = updateMovie(userId, movieId, req.body || {});

    if (movie === null) {
      return res.status(404).json({ error: "Movie or user not found" });
    }

    return res.status(200).json(movie);
  }
);

// Delete a movie from a user's watchlist.
router.delete(
  "/:userId/movies/:movieId",
  authorizeModification,
  (req, res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);

    const deleted = deleteMovie(userId, movieId);

    if (deleted === null) {
      return res.status(404).json({ error: "Movie or user not found" });
    }

    return res.status(200).json({
      message: "Movie deleted successfully",
    });
  }
);

export default router;
