
import { config } from "dotenv";
config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg';


const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });


const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    adapter: new PrismaPg(pool)
});

const userId = "0e3fa58c-bbc7-466d-8cc5-ec29b263bfba"


const movies = [
    {
      title: "Wilderness Fighter",
      releaseYear: 2010,
      genres: ["sci-fi", "action"],
      runtime: 155,
      posteUrl: "https://example.com/WildernessFighter.jpg",
      createdBy: userId
    },

    {
      title: "Strong Hunter",
      releaseYear: 2011,
      genres: ["Drama", "Humor"],
      runtime: 200,
      posteUrl: "https://example.com/StrongHunter.jpg",
      createdBy: userId
    },

    {
      title: "Agony",
      releaseYear: 2012,
      genres: ["Adventure"],
      runtime: 220,
      posteUrl: "https://example.com/StrongHunter.jpg",
      createdBy: userId
    }
];

const main = async () => {
    console.log("Seeding movies...");

    for (const movie of movies) {
        await prisma.movie.create({
            data: movie
        });
        console.log(`Created movie: ${movie.title}`);
    }
}  

main().catch((err) => {
    console.error(err);
    process.exit(1);                  // This immediately stops the Node.js process and returns an exit code to the operating system. 0: success, 1: Error/Abnormal termination
}).finally( async () => {
    await prisma.$disconnect();
});





/*

(node:3152) Warning: SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'.
In the next major version (pg-connection-string v3.0.0 and pg v9.0.0), these modes will adopt standard libpq semantics, which have weaker security guarantees.

To prepare for this change:
- If you want the current behavior, explicitly use 'sslmode=verify-full'
- If you want libpq compatibility now, use 'uselibpqcompat=true&sslmode=require'

*/
