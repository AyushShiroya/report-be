const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
// Updated registration controller
exports.registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    
    try {
        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                message: "User with this email already exists" 
            });
        }

        // Create new user
        const user = await User.create({ 
            firstName,
            lastName,
            email, 
            password 
        });

        res.status(201).json({ 
            message: "User registered successfully", 
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
                // Don't send back password
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            message: "Server Error",
            error: error.message 
        });
    }
};

// User Login
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email'); // Fetch only name & email
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};
