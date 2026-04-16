import { Router } from 'express';
import { BlockchainController } from './blockchain.controller';
import { WalletController } from './wallet.controller';
import { Blockchain } from '../blockchain';

export const createBlockchainRouter = (blockchain: Blockchain) => {
  const router = Router();
  const blockchainController = new BlockchainController(blockchain);
  const walletController = new WalletController();

  router.get('/chain', blockchainController.getChain);
  router.get('/pending-transactions', blockchainController.getPendingTransactions);
  router.get('/balance/:address', blockchainController.getBalance);
  router.post('/mine', blockchainController.mineTransactions);
  router.post('/transaction', blockchainController.addTransaction);
  
  router.post('/wallet/generate', walletController.generateWallet);

  return router;
};
