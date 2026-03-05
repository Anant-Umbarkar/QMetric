const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Model/user');
const { generateCaptcha } = require('../core/captcha/captchaGenerator');

// Store active CAPTCHAs temporarily (in production, use Redis)
const activeCaptchas = new Map();

// Generate CAPTCHA
const generateCaptchaController = (req, res) => {
  const captcha = generateCaptcha(6);
  const captchaId = Date.now().toString();
  
  // Store CAPTCHA for 5 minutes
  activeCaptchas.set(captchaId, captcha);
  setTimeout(() => activeCaptchas.delete(captchaId), 5 * 60 * 1000);
  
  console.log(`📝 Generated CAPTCHA ${captchaId}: ${captcha}`);
  
  return res.json({
    error: false,
    captchaId,
    captcha, // Send captcha to frontend (so it can be displayed)
  });
};

// Login Controller
const login = async (req, res) => {
    console.log("📝 Login request received:", req.body);
    const { email, password, captchaId, captchaInput } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
        console.log("❌ Missing email or password");
        return res.status(400).json({
            error: true,
            message: "Credentials required.",
        });
    }

    // Verify CAPTCHA
    if (!captchaId || !captchaInput) {
        console.log("❌ CAPTCHA not provided");
        return res.status(400).json({
            error: true,
            message: "CAPTCHA is required.",
        });
    }

    const storedCaptcha = activeCaptchas.get(captchaId);
    if (!storedCaptcha) {
        console.log("❌ CAPTCHA expired or invalid");
        return res.status(400).json({
            error: true,
            message: "CAPTCHA expired. Please try again.",
        });
    }

    // Case-insensitive CAPTCHA comparison
    if (captchaInput.toUpperCase() !== storedCaptcha.toUpperCase()) {
        console.log("❌ CAPTCHA mismatch", captchaInput, "vs", storedCaptcha);
        activeCaptchas.delete(captchaId); // Delete used CAPTCHA
        return res.status(401).json({
            error: true,
            message: "Incorrect CAPTCHA",
        });
    }

    console.log("✅ CAPTCHA verified");
    activeCaptchas.delete(captchaId); // Delete used CAPTCHA

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        console.log("❌ User not found:", email);
        return res.status(404).json({
            error: true,
            message: "User does not exist.",
        });
    }

    console.log("✅ User found:", email);

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        console.log("❌ Invalid password for:", email);
        return res.status(401).json({
            error: true,
            message: "Invalid credentials",
        });
    }

    console.log("✅ Password valid for:", email);

    try {
        // Generate JWT Token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        console.log("✅ Login successful for:", email);
        return res.json({
            error: false,
            message: "Login successful",
            user: { userName: user.userName, email: user.email },
            accessToken,
        });
    } catch (error) {
        console.log("❌ Token creation error:", error.message);
        return res.status(500).json({ error: true, message: "Error creating token" });
    }
};

module.exports = {
    generateCaptcha: generateCaptchaController,
    login,
};
