import express from 'express';
import cors from 'cors';
import { Blockchain } from '../blockchain';
import { createBlockchainRouter } from './routes';

export const createApp = (blockchain: Blockchain) => {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api', createBlockchainRouter(blockchain));

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
  });

  return app;
};
