import { Blockchain } from '../src/blockchain';
import { Transaction } from '../src/transaction';

describe('Blockchain', () => {
  let blockchain: Blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  test('should create the genesis block', () => {
    expect(blockchain.chain.length).toBe(1);
    expect(blockchain.chain[0]!.transactions).toEqual([]);
  });

  test('should add a transaction and mine it', () => {
    const tx = new Transaction('addr1', 'addr2', 50);
    blockchain.addTransaction(tx);
    blockchain.minePendingTransactions('miner-addr');

    expect(blockchain.chain.length).toBe(2);
    expect(blockchain.chain[1]!.transactions.length).toBe(2); // tx + reward
    expect(blockchain.getBalanceOfAddress('addr1')).toBe(-50);
    expect(blockchain.getBalanceOfAddress('addr2')).toBe(50);
    expect(blockchain.getBalanceOfAddress('miner-addr')).toBe(100);
  });

  test('should handle multiple transactions in a block', () => {
    blockchain.addTransaction(new Transaction('addr1', 'addr2', 50));
    blockchain.addTransaction(new Transaction('addr2', 'addr1', 20));
    blockchain.minePendingTransactions('miner-addr');

    expect(blockchain.getBalanceOfAddress('addr1')).toBe(-30);
    expect(blockchain.getBalanceOfAddress('addr2')).toBe(30);
  });

  test('should validate the chain', () => {
    blockchain.addTransaction(new Transaction('addr1', 'addr2', 50));
    blockchain.minePendingTransactions('miner-addr');

    expect(blockchain.isChainValid()).toBe(true);
  });

  test('should invalidate the chain if a transaction is tempered', () => {
    blockchain.addTransaction(new Transaction('addr1', 'addr2', 50));
    blockchain.minePendingTransactions('miner-addr');

    blockchain.chain[1]!.transactions[0]!.amount = 5000;

    expect(blockchain.isChainValid()).toBe(false);
  });
});
