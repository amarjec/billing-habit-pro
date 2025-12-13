import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if (tokenDecode.id) {
            // FIX: Attach to 'req' object directly, NOT 'req.body'
            // This ensures it works for GET requests too.
            req.userId = tokenDecode.id; 
            next();
        } else {
            return res.json({ success: false, message: "Not Authorized. Login Again." });
        }

    } catch (error) {
        return res.json({ success: false, message: "Invalid Token. Login Again." });
    }
};

export default userAuth;