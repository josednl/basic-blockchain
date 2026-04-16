import { Request, Response } from 'express';
import { Blockchain } from '../blockchain';
import { Transaction } from '../transaction';

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
    const { fromAddress, toAddress, amount, signature } = req.body;

    if (!fromAddress || !toAddress || !amount || !signature) {
      return res.status(400).json({ error: 'Missing transaction details (fromAddress, toAddress, amount, signature)' });
    }

    try {
      const tx = new Transaction(fromAddress, toAddress, amount);
      tx.signature = signature;

      this.blockchain.addTransaction(tx);
      res.status(201).json({ message: 'Transaction added to pending transactions', transaction: tx });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
}
