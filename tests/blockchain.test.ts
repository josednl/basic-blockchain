import { Blockchain } from '../src/blockchain';
import { Transaction } from '../src/transaction';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');
const myKey = ec.genKeyPair();
const myWalletAddress = myKey.getPublic('hex');

describe('Blockchain', () => {
  let blockchain: Blockchain;

  beforeEach(() => {
    blockchain = new Blockchain();
  });

  test('should create the genesis block', () => {
    expect(blockchain.chain.length).toBe(1);
    expect(blockchain.chain[0]!.transactions).toEqual([]);
  });

  test('should sign a transaction and mine it', () => {
    const tx = new Transaction(myWalletAddress, 'toAddress', 50);
    tx.signTransaction(myKey);
    blockchain.addTransaction(tx);
    blockchain.minePendingTransactions('miner-addr');

    expect(blockchain.chain.length).toBe(2);
    expect(blockchain.chain[1]!.transactions.length).toBe(2); // tx + reward
    expect(blockchain.getBalanceOfAddress(myWalletAddress)).toBe(-50);
    expect(blockchain.getBalanceOfAddress('toAddress')).toBe(50);
  });

  test('should not add an unsigned transaction', () => {
    const tx = new Transaction(myWalletAddress, 'toAddress', 50);
    expect(() => {
      blockchain.addTransaction(tx);
    }).toThrow('No signature in this transaction');
  });

  test('should not add a transaction signed with a different key', () => {
    const otherKey = ec.genKeyPair();
    const tx = new Transaction(myWalletAddress, 'toAddress', 50);
    expect(() => {
      tx.signTransaction(otherKey);
    }).toThrow('You cannot sign transactions for other wallets!');
  });

  test('should validate the chain with signed transactions', () => {
    const tx1 = new Transaction(myWalletAddress, 'addr2', 50);
    tx1.signTransaction(myKey);
    blockchain.addTransaction(tx1);
    blockchain.minePendingTransactions('miner-addr');

    expect(blockchain.isChainValid()).toBe(true);
  });

  test('should invalidate the chain if a signed transaction is tempered', () => {
    const tx1 = new Transaction(myWalletAddress, 'addr2', 50);
    tx1.signTransaction(myKey);
    blockchain.addTransaction(tx1);
    blockchain.minePendingTransactions('miner-addr');

    blockchain.chain[1]!.transactions[0]!.amount = 5000;

    expect(blockchain.isChainValid()).toBe(false);
  });
});
