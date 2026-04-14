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

  public calculateHash(): string {
    const dataString = JSON.stringify(this.transactions);
    return crypto
      .createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + dataString + this.nonce)
      .digest('hex');
  }

  public mineBlock(difficulty: number): void {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }

  public hasValidTransactions(): boolean {
    for (const tx of this.transactions) {
      if (!tx.isValid()) {
        return false;
      }
    }
    return true;
  }
}
