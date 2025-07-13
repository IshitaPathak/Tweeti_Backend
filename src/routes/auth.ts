import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const sql = neon(process.env.DATABASE_URL!);

// GitHub OAuth endpoints
router.get('/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo user`;
  res.redirect(githubAuthUrl);
});

router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;
    // Exchange code for access token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data = await response.json();
    res.json({ token: data.access_token });
  } catch (error) {
    console.error('GitHub auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;
