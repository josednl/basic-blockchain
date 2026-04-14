import { Block } from './block';

export class Blockchain {
  public chain: Block[];
  public difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  private createGenesisBlock(): Block {
    return new Block(0, Date.now(), 'Genesis Block', '0');
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1]!;
  }

  public addBlock(newBlock: Block): void {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i]!;
      const previousBlock = this.chain[i - 1]!;

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
