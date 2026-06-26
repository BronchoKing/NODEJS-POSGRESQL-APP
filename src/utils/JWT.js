import jwt from "jsonwebtoken"

export const generateToken = (userId, res) => {                   // Adding the response object as a parameter to the generateToken function
    const payload = { id: userId}
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRATION || "1d"             // 1d = default value
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",             // The secure property in a cookie controls how the cookie is sent over the network.
        sameSite: "strict",
        maxAge: (1000 * 60 * 60 * 24) * 7
        
    });

    return token;
}

