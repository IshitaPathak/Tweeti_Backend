import express from 'express';
import { saveXCredentials } from '../controllers/credentials.controller';

const router = express.Router();

router.post('/save-x-credentials', saveXCredentials);

export default router;
