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

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.toLowerCase();

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPass = await encrypt(password);

    const user = await User.create({
      username,
      email: normalizedEmail,
      password: hashedPass
    });

    return res.status(201).json({
      success: true,
      message: "User registered",
      userId: user._id
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};
