import { Block } from './block';
import { Transaction } from './transaction';

export class Blockchain {
  public chain: Block[];
  public difficulty: number;
  public pendingTransactions: Transaction[];
  public miningReward: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  /**
   * Initializes the blockchain with a genesis block.
   */
  private createGenesisBlock(): Block {
    return new Block(0, Date.now(), [], '0');
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]!;
  }

  /**
   * Mines all pending transactions and adds them to a new block.
   * Also issues a mining reward to the given address.
   */
  public minePendingTransactions(miningRewardAddress: string): void {
    // 1. Create a reward transaction for the miner
    const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    // 2. Bundle all pending transactions into a new block
    const block = new Block(
      this.chain.length,
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    // 3. Perform mining (Proof-of-Work)
    block.mineBlock(this.difficulty);

    console.log('Block successfully mined!');
    this.chain.push(block);

    // 4. Reset pending transactions list
    this.pendingTransactions = [];
  }

  /**
   * Validates a new transaction before adding it to the pending list.
   */
  public addTransaction(transaction: Transaction): void {
    if (!transaction.fromAddress || !transaction.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    if (!transaction.isValid()) {
      throw new Error('Cannot add invalid transaction to chain');
    }

    if (transaction.amount <= 0) {
      throw new Error('Transaction amount should be higher than 0');
    }

    this.pendingTransactions.push(transaction);
  }

  /**
   * Iterates through the entire blockchain to calculate the balance for a given address.
   */
  public getBalanceOfAddress(address: string): number {
    let balance = 0;

    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.amount;
        }

        if (trans.toAddress === address) {
          balance += trans.amount;
        }
      }
    }

    return balance;
  }

  /**
   * Checks the integrity of the entire blockchain.
   * Verifies hashes, links between blocks, and transaction signatures.
   */
  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]!;
      const previousBlock = this.chain[i - 1]!;

      if (!currentBlock.hasValidTransactions()) {
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}
