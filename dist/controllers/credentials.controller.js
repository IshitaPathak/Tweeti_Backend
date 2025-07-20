"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveXCredentials = void 0;
const serverless_1 = require("@neondatabase/serverless");
const sql = (0, serverless_1.neon)(process.env.DATABASE_URL);
const saveXCredentials = async (req, res) => {
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
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Error saving X credentials:', error);
        return res.status(500).json({ error: 'Failed to save credentials' });
    }
};
exports.saveXCredentials = saveXCredentials;
