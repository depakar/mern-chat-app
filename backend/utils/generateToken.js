// JWT is a compact token format used for securely transmitting information between the client and server.

import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "15d",
	});
    //jwt.sign creates a new token with a payload (in this case, the userId).
//process.env.JWT_SECRET is a secret key stored in your environment variables. This key is used to sign the token and ensure its authenticity. Only the server knows the secret, so only the server can generate or verify the token.
//expiresIn: "15d" specifies that the token will expire in 15 days. After that, the token will be invalid, and the user will need to log in again.

	res.cookie("jwt", token, {
		maxAge: 15 * 24 * 60 * 60 * 1000, // MS
		httpOnly: true, // prevent XSS attacks cross-site scripting attacks
		sameSite: "strict", // CSRF attacks cross-site request forgery attacks
		secure: process.env.NODE_ENV !== "development",
	});
};

export default generateTokenAndSetCookie;