import { config } from "dotenv";
config();


import { PrismaClient} from "@prisma/client"
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg';


const __pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
 

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    adapter: new PrismaPg(__pool)
});

    console.log("DB STRING --->", __pool)


const connectDB = async () => {
    try {
        await prisma.$connect(); 
        console.log('DB connected via Prisma');
    } catch (error) {
        console.error(`Database connection error: ${error.message}`);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    await prisma.$disconnect();
}

export {prisma, connectDB, disconnectDB};