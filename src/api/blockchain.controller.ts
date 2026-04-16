import { Request, Response } from 'express';
import { Blockchain } from '../blockchain';

export class BlockchainController {
  constructor(private blockchain: Blockchain) {}

  public getChain = (req: Request, res: Response) => {
    res.json(this.blockchain.chain);
  };

  public getPendingTransactions = (req: Request, res: Response) => {
    res.json(this.blockchain.pendingTransactions);
  };

  public getBalance = (req: Request, res: Response) => {
    const { address } = req.params;
    if (typeof address !== 'string') {
      return res.status(400).json({ error: 'Invalid address' });
    }
    const balance = this.blockchain.getBalanceOfAddress(address);
    res.json({ address, balance });
  };

  public mineTransactions = (req: Request, res: Response) => {
    const { minerAddress } = req.body;
    if (!minerAddress) {
      return res.status(400).json({ error: 'Miner address is required' });
    }

    try {
      this.blockchain.minePendingTransactions(minerAddress);
      res.json({ message: 'Block successfully mined!', chain: this.blockchain.chain });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  public addTransaction = (req: Request, res: Response) => {
    // This is a simplified version. Usually, we'd receive a signed transaction.
    // For this basic API, we'll assume the client sends the transaction details
    // and we'll need a way to validate it.
    // However, the Blockchain.addTransaction(transaction) expects a Transaction object
    // that is already signed.
    
    // For now, let's just return an error or a placeholder if we don't have the full signing logic here.
    res.status(501).json({ error: 'Not implemented: Transactions must be signed by the client.' });
  };
}
