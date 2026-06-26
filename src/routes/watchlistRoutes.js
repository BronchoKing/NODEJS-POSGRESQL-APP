import express from "express";
import { register, login, logout } from "../controllers/authController.js"
import { addToWatchlist, deleteFromWatchlist, updateWatchlist } from "../controllers/watchlistController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequestMiddleware.js";
import { addToWatchlistSchema } from "../validators/watchlistValidators.js";


const router = express.Router();

// Middleware applied to all routes for authentication
router.use(authMiddleware);

// Middleware applied to a specific route
router.post("/", validateRequest(addToWatchlistSchema), addToWatchlist);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update/:id", authMiddleware, updateWatchlist);
router.delete("/deleteMovie/:id", authMiddleware, deleteFromWatchlist);



export default router;