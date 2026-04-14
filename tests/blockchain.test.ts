import { Blockchain } from '../src/blockchain';
import { Block } from '../src/block';

describe('Blockchain', () => {
  let blockchain: Blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  test('should create the genesis block', () => {
    expect(blockchain.chain.length).toBe(1);
    expect(blockchain.chain[0]!.data).toBe('Genesis Block');
  });

  test('should add a new block', () => {
    const newBlock = new Block(1, Date.now(), { amount: 100 });
    blockchain.addBlock(newBlock);

    expect(blockchain.chain.length).toBe(2);
    expect(blockchain.chain[1]!.data).toEqual({ amount: 100 });
    expect(blockchain.chain[1]!.previousHash).toBe(blockchain.chain[0]!.hash);
  });

  test('should validate the chain', () => {
    blockchain.addBlock(new Block(1, Date.now(), { amount: 100 }));
    blockchain.addBlock(new Block(2, Date.now(), { amount: 200 }));

    expect(blockchain.isChainValid()).toBe(true);
  });

  test('should invalidate the chain if a block is tempered', () => {
    blockchain.addBlock(new Block(1, Date.now(), { amount: 100 }));
    blockchain.chain[1]!.data = { amount: 500 };

    expect(blockchain.isChainValid()).toBe(false);
  });
});
