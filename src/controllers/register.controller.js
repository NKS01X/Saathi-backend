import { User } from "../models/register.scheme.js";
import { encrypt } from "../utils/utils.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the fields"
      });
    }

    const hashedPass = await encrypt(password);

    const user = await User.create({
      username,
      email,
      password: hashedPass
    });

    return res.status(201).json({
      success: true,
      message: "User registered",
      userId: user._id
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
};
