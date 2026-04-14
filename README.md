# Basic TypeScript Blockchain

A educational implementation of a blockchain in TypeScript, featuring Proof-of-Work, transaction signing, and a reward system for miners.

## Features

- **Proof-of-Work (PoW)**: Adjustable difficulty for mining new blocks.
- **Transaction Signing**: Cryptographic security using Elliptic Curve (secp256k1) to ensure only wallet owners can authorize transactions.
- **Mining Rewards**: Automatic reward distribution for miners who secure the network.
- **Integrity Validation**: Comprehensive checks for chain consistency and transaction validity.
- **Unit Testing**: Full test suite powered by Jest.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/josednl/basic-blockchain.git
   cd basic-blockchain
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Usage

The project is structured as a library. You can import `Blockchain`, `Block`, and `Transaction` into your own scripts.

Example of creating a transaction and mining it:
```typescript
import { Blockchain } from './src/blockchain';
import { Transaction } from './src/transaction';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');
const myKey = ec.genKeyPair();
const myWalletAddress = myKey.getPublic('hex');

const myCoin = new Blockchain();

// Create and sign a transaction
const tx1 = new Transaction(myWalletAddress, 'public-key-goes-here', 10);
tx1.signTransaction(myKey);
myCoin.addTransaction(tx1);

// Start mining
console.log('Starting the miner...');
myCoin.minePendingTransactions(myWalletAddress);

console.log('Balance is:', myCoin.getBalanceOfAddress(myWalletAddress));
```

## Development

### Running Tests

To run the unit tests and verify the blockchain's integrity:
```bash
npm test
```

### Pre-commit Validation

Before committing any changes, it is recommended to run the full validation (Type checking + Tests):
```bash
npm run precommit
```

## Documentation for Agents

For detailed technical guidance and architectural patterns used in this project, refer to [AGENTS.md](./AGENTS.md).

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
