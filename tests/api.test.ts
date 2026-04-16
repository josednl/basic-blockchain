import request from 'supertest';
import { createApp } from '../src/api/app';
import { Blockchain } from '../src/blockchain';
import { Transaction } from '../src/transaction';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

describe('Blockchain API', () => {
  let blockchain: Blockchain;
  let app: any;

  beforeEach(() => {
    blockchain = new Blockchain();
    app = createApp(blockchain);
  });

  it('should return the initial blockchain', async () => {
    const res = await request(app).get('/api/chain');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1); // Genesis block
  });

  it('should return an empty list of pending transactions', async () => {
    const res = await request(app).get('/api/pending-transactions');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('should generate a new wallet', async () => {
    const res = await request(app).post('/api/wallet/generate');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('publicKey');
    expect(res.body).toHaveProperty('privateKey');
  });

  it('should get the balance of an address', async () => {
    const address = 'test-address';
    const res = await request(app).get(`/api/balance/${address}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ address, balance: 0 });
  });

  it('should fail to mine without a miner address', async () => {
    const res = await request(app).post('/api/mine').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Miner address is required');
  });

  it('should successfully mine blocks', async () => {
    const minerAddress = 'miner-1';
    const res = await request(app).post('/api/mine').send({ minerAddress });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Block successfully mined!');
    expect(res.body.chain.length).toBe(2);
  });

  it('should add a valid signed transaction', async () => {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const toAddress = 'recipient-1';
    const amount = 50;

    const tx = new Transaction(publicKey, toAddress, amount);
    tx.signTransaction(key);

    const res = await request(app).post('/api/transaction').send({
      fromAddress: publicKey,
      toAddress: toAddress,
      amount: amount,
      signature: tx.signature
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Transaction added to pending transactions');
    expect(blockchain.pendingTransactions.length).toBe(1);
  });

  it('should fail to add an invalid transaction', async () => {
    const res = await request(app).post('/api/transaction').send({
      fromAddress: 'invalid',
      toAddress: 'recipient',
      amount: 10,
      signature: 'invalid-sig'
    });

    expect(res.status).toBe(400);
  });
});
