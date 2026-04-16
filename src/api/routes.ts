import { Router } from 'express';
import { BlockchainController } from './blockchain.controller';
import { Blockchain } from '../blockchain';

export const createBlockchainRouter = (blockchain: Blockchain) => {
  const router = Router();
  const controller = new BlockchainController(blockchain);

  router.get('/chain', controller.getChain);
  router.get('/pending-transactions', controller.getPendingTransactions);
  router.get('/balance/:address', controller.getBalance);
  router.post('/mine', controller.mineTransactions);
  router.post('/transaction', controller.addTransaction);

  return router;
};
