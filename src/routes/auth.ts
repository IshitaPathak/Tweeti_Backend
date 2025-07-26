import { Router } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const sql = neon(process.env.DATABASE_URL!);

// GitHub OAuth endpoints
router.get('/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=public_repo user`;
  res.redirect(githubAuthUrl);
});

router.get('/github/callback', async (req, res) => {
  try {
    const { code } = req.query;

    // Step 1: Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
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

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      return res.status(400).json({ error: 'Failed to obtain access token' });
    }

    // Step 2: Use access token to get user info
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'User-Agent': 'Node.js App',
      },
    });

    const userData = await userResponse.json();
    const username = userData.login;
    
    console.log('GitHub user data:', userData);
    console.log('Extracted username:', username);
    console.log('FRONTEND_URL from env:', process.env.FRONTEND_URL);
 
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
    console.log('Final redirect URL:', `${FRONTEND_URL}?username=${username}`);
    res.redirect(`${FRONTEND_URL}?username=${username}`);
  } catch (error) {
    console.error('GitHub auth error:', error);
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${FRONTEND_URL}?error=auth_failed`);
  }

});


export default router;
