import jwt from "jsonwebtoken";
import { User } from "../models/register.schema.js";

export const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).redirect("/signin");
    }

    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.redirect("/signin");
    }

    req.user = user;
    next();

  } catch (err) {
    return res.redirect("/signin");
  }
};
