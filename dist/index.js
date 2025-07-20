"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const serverless_1 = require("@neondatabase/serverless");
const auth_1 = __importDefault(require("./routes/auth"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
// Auth routes
app.use('/api/auth', auth_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
// X Credentials endpoint
app.post('/api/save-x-credentials', async (req, res) => {
    try {
        const { github_username, access_token, access_secret } = req.body;
        if (!github_username || !access_token || !access_secret) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        await sql `
      INSERT INTO x_credentials (
        github_username,
        access_token,
        access_secret,
        created_at
      )
      VALUES (
        ${github_username},
        ${access_token},
        ${access_secret},
        NOW()
      )
      ON CONFLICT (github_username) 
      DO UPDATE SET 
        access_token = ${access_token},
        access_secret = ${access_secret},
        created_at = NOW();
    `;
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error saving X credentials:', error);
        res.status(500).json({ error: 'Failed to save credentials' });
    }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
// 
