import { z } from "zod";

// Schema defined for addToWatchList route
const addToWatchlistSchema = z.object({
    movieId: z.string().uuid(),
    status: z.enum(["PLANNED", "WATCHING", "COMPLETED", "DROPPED"], {
        error: () => ({
            message: "Status must be one of: PLANNED, WATCHING, COMPLETED, DROPPED"
        })
    }).optional(),
    rating: z.coerce
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must not be greater than 5")
    .optional(),
    notes: z.string().optional()
})

export { addToWatchlistSchema }
