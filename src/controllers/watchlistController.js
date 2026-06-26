import { prisma } from "../config/db.js";


const addToWatchlist = async (req, res) => {
    const { movieId, status, rating, notes } = req.body;

    // Verify if movie exists
    const movie = await prisma.movie.findUnique({
        where: { id: movieId }    
    });

    if(!movie) {
        return res.status(404).json({
            error: "Movie not found"
        });
    }

    // Check if a movie is already added to the watchlist
    const existingInWatchlist = await prisma.watchlistItem.findUnique({
        where: {
            userId_movieId: {
                userId: req.user.id,              // Current user object was attached to the req body, and we access the user id from that current user object
                movieId: movieId
            }
        }
    });
        console.log("ExistingInWatchList:", existingInWatchlist);

    if(existingInWatchlist) {
        res.status(400).json({
            error: "Movie already in the watchlist"
        });
    }

        const watchlisItem = await prisma.watchlistItem.create({
        data: {
            userId: req.user.id,
            movieId,
            status: status || "PLANNED",
            rating,
            notes
        }
    });
    
    res.status(201).json({
        status: "success",
        data : {
            watchlisItem
        }
    });

} // end

// Update a movie item from the watchlist
const updateWatchlist = async (req, res) => {
    const { rating, notes } = req.body;

    const watchlisItem = await prisma.watchlistItem.findUnique({
        where: { 
            id: req.params.id 
        }
    });

    if(!watchlisItem) {
        return res.status(404).json({
            error: "Movie with the provided ID doesn't exist"
        });
    }

    if(watchlisItem.userId !== req.user.id) {
        return res.status(403).json({
            status: "fail",
            error: "Not allowed to update a watchlist item"
        });
    }

  
     const updatedWatchlistItem = await prisma.watchlistItem.update({
        where: {
            id: req.params.id
        },

        data: {
            rating,
            notes
        }
      });
    

    return res.status(200).json({
        status: "success",
        data: {
            updatedWatchlistItem
        }
    });

}  // end


// Delete a movie item from the watchlist
const deleteFromWatchlist = async (req, res) => {
    const watchlistItem = await prisma.watchlistItem.findUnique({
        where: {
            id: req.params.id
        }
    });

    if(!watchlistItem) {
        return res.status(404).json({
            error: "Movie with the provided ID doesn't exist"
        });
    }

    if(watchlistItem.userId !== req.user.id) {
        return res.status(403).json({
            status: "fail",
            error: "Not allowed to delete a watchlist item"
        });
    }

    if(watchlistItem) {
         await prisma.watchlistItem.delete({
            where: {
                id: req.params.id
            }
        });
    }

    res.status(200).json({
        status:"success",
        message: "Movie deleted from watchlist"
    });


}   // end




export { addToWatchlist, deleteFromWatchlist,updateWatchlist };