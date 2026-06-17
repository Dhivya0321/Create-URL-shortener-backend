const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage
const urls = {};

// Generate short code
function generateCode() {
    return Math.random().toString(36).substring(2, 8);
}

// Create short URL
app.post("/shorten", (req, res) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({
            success: false,
            message: "URL is required"
        });
    }

    const shortCode = generateCode();

    urls[shortCode] = originalUrl;

    res.json({
        success: true,
        originalUrl,
        shortUrl: `http://localhost:${PORT}/${shortCode}`
    });
});

// Redirect to original URL
app.get("/:code", (req, res) => {
    const code = req.params.code;

    if (urls[code]) {
        return res.redirect(urls[code]);
    }

    res.status(404).json({
        success: false,
        message: "Short URL not found"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});