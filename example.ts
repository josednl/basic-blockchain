import { Blockchain } from './src/blockchain';
import { Transaction } from './src/transaction';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');
const myKey = ec.genKeyPair();
const myWalletAddress = myKey.getPublic('hex');

const myCoin = new Blockchain();

// 1. Create and sign a transaction
const tx1 = new Transaction(myWalletAddress, 'friend-public-address', 50);
tx1.signTransaction(myKey);
myCoin.addTransaction(tx1);

// 2. Mine pending transactions
console.log('Mining block...');
myCoin.minePendingTransactions(myWalletAddress);

// 3. Check balances
console.log(`Your balance is: ${myCoin.getBalanceOfAddress(myWalletAddress)}`);
console.log(`Is the chain valid? ${myCoin.isChainValid()}`);
