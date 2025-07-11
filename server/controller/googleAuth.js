import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import UserModel from "../models/userSchema.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ status: false, message: "Google token is required" });
    }

    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await UserModel.findOne({ email });

    if (!user) {
      // Create new user
      user = new UserModel({
        fullName: name,
        email,
        image: picture,
        googleId,
        role: "user", // Default role
        password: "google-auth-" + Math.random().toString(36).substring(2, 15), // Dummy password for Google users
      });
      await user.save();
    } else {
      // Update existing user's Google ID and image if not set
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.image) {
        user.image = picture;
      }
      await user.save();
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: process.env.COOKIE_EXPIRES,
      }
    );

    res.status(200).json({
      status: true,
      message: "Google login successful",
      token: jwtToken,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Google login error:", error);
    res
      .status(500)
      .json({ status: false, message: "Google authentication failed" });
  }
};

export { googleLogin };
