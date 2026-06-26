import jwt from "jsonwebtoken"
import {prisma} from "../config/db.js"



export const authMiddleware = async (req, res, next) => {
    //console.log("Authentication middleware");
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if(req.cookies?.jwt) {
        token = req.cookies.jwt;
    } 

    if(!token) {
        return res.status(401).json({
            error: "Not authorized, no token provided"
        });
    }

    try {
        // Verify token and extract the user Id
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        const user = await prisma.user.findUnique({
            where: { id: decoded.id}
        });

        if(!user) {
            return res.status(401).json({
                error: "User no longer exists"
            });
        }

        req.user = user;                                      // Attach authenticated user to the request object
        next();

    } catch (err) {
        return res.status(401).json({ 
            error: "Not authorized, token failed"
        });
    }
}