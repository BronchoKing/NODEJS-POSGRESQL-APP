import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/JWT.js";

const register = async (req, res) => {
    const body = req.body;
    const { name, email, password} = body;

    console.log("CREDENTIALS", name, email, password);

    
    // check if a user exists
    const userExists = await prisma.user.findUnique({
        where: {email: email}
    });

    if(userExists) {
        return res.status(400).json({
            error: "User already exists"
        });
    }
    

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const token = generateToken(user.id, res);

    
    // Create user
    const user = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword
        }
    });

    res.status(201).json({
        status: "success",
        data: {
            user: {
            id: user.id,
            name: name,
            email: email,
            password: hashedPassword
            },
            JWT: token
        }
    });
}

// User login controller function
const login = async (req, res) => {
    const {email, password} = req.body;

    // Check if user email exists in the table
    const user = await prisma.user.findUnique({
        where: {email: email}
    });

    if(!user) {
        return res.status(401).json({
            status: "fail",
            message: "Invalid user email or password"

        });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return res.status(401).json({
            status: "fail",
            message: "Invalid email or password"
        });
    }

    // Generate JWT Token
    const token = generateToken(user.id, res);

    if(user && isPasswordValid) {
        return res.status(201).json({
            status: "success",
            data: {
                user: {
                    id: user.id,
                    email: email
                },
                JWT: token 
            }
        });
    }
}


const logout = async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });
    return res.status(200).json({
        status: "success",
        message: "Logged out successfully"
    })
}

// Export functions
export {register, login, logout};