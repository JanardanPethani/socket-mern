import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });

  res.cookie("jwt", token, {
    httpOnly: true, // prevent client-side JS from accessing the cookie
    sameSite: "strict", // prevent CSRF attacks [cross-site request forgery]
    secure: process.env.NODE_ENV !== "development", // only send the cookie over HTTPS in production
    maxAge: 24 * 60 * 60 * 1000, // in MS
  });

  return token;
};
