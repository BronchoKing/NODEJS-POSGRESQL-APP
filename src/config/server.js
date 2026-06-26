import express from 'express'
import {config} from 'dotenv';
import { prisma, connectDB, disconnectDB } from "./db.js";

import movieRoute from "../routes/movieRoute.js";
import authRoute from "../routes/authRoute.js";
import watchlisRoutes from "../routes/watchlistRoutes.js"


//config();    // Calling the config function of dotenv module
connectDB();

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use('/movies', movieRoute);
app.use('/user', authRoute);
app.use('/watchlist', watchlisRoutes);


const server = app.listen(process.env.PORT || 8080, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});

console.log("CURRENT DIRECTORY", process.cwd());




// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Uncaught Exception', err);
    server.close(async () => {
        await disconnectDB();
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', async (err) => {
    console.error('Uncaught Exception:', err);
    await disconnectDB();
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(async () => {
        await disconnectDB();
        process.exit(0);
    });
});

console.log("WHERE?",process.env.DATABASE_URL)
console.log("PORT?",process.env.PORT)

