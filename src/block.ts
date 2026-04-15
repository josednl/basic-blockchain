import * as crypto from 'crypto';
import { Transaction } from './transaction';

export class Block {
  public hash: string;
  public nonce: number;

  constructor(
    public index: number,
    public timestamp: number,
    public transactions: Transaction[],
    public previousHash: string = ''
  ) {
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Generates a SHA256 hash of all the block's fields (index, previousHash, timestamp, transactions, and nonce).
   */
  public calculateHash(): string {
    const dataString = JSON.stringify(this.transactions);
    return crypto
      .createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + dataString + this.nonce)
      .digest('hex');
  }

  /**
   * Implements Proof-of-Work. It repeatedly changes the nonce and recalculates the hash
   * until the hash starts with a specific number of leading zeros (difficulty).
   */
  public mineBlock(difficulty: number): void {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }

  /**
   * Validates all the transactions within this block.
   */
  public hasValidTransactions(): boolean {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}
