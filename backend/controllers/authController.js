const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/user');

// Create Account Controller
const createAccount = async (req, res) => {
    const { userName, email, password } = req.body;

    // Check if all fields are provided
    if (!userName || !email || !password) {
        return res.status(400).json({
            error: true,
            message: "All fields are required",
        });
    }

    // Check if user already exists
    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(409).json({
            error: true,
            message: "User already exists",
        });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
        userName,
        email,
        password: hashPassword,
    });

    await user.save();

    try {
        // Create JWT Token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        return res.json({
            error: false,
            message: "Account created successfully",
            user: { userName: user.userName, email: user.email },
            accessToken,
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error creating token" });
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        return res.status(400).json({
            error: true,
            message: "Credentials required.",
        });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({
            error: true,
            message: "User does not exist.",
        });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid credentials",
        });
    }

    try {
        // Generate JWT Token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        return res.json({
            error: false,
            message: "Login successful",
            user: { userName: user.userName, email: user.email },
            accessToken,
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error creating token" });
    }
};

module.exports = {
    createAccount,
    login,
};
