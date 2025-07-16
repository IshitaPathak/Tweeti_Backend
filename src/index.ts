import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const sql = neon(process.env.DATABASE_URL!);

// Auth routes
app.use('/api/auth', authRoutes);

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

    await sql`
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
  } catch (error) {
    console.error('Error saving X credentials:', error);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// 