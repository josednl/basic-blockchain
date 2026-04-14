# Basic Blockchain (AI Agents Documentation)

This project is a basic blockchain implementation in TypeScript, designed to demonstrate the core concepts of decentralization, cryptographic integrity, and proof-of-work.

## Technical Stack
- **TypeScript**: Core language.
- **Node.js**: Runtime environment.
- **Jest**: Testing framework.
- **Elliptic**: Elliptic curve cryptography (secp256k1) for transaction signing.
- **Crypto**: Node.js native module for SHA-256 hashing.

## Core Components

### 1. `Block` (`src/block.ts`)
Represents a single block in the chain.
- Contains transactions, timestamp, previous hash, and a nonce for mining.
- `calculateHash()`: Generates a SHA-256 hash of the block's contents.
- `mineBlock(difficulty)`: Implements Proof-of-Work by finding a hash with a specific number of leading zeros.
- `hasValidTransactions()`: Validates all transactions within the block.

### 2. `Blockchain` (`src/blockchain.ts`)
Manages the entire chain and its integrity.
- `minePendingTransactions(rewardAddress)`: Packages pending transactions into a new block, adds a mining reward, and mines it.
- `addTransaction(transaction)`: Validates and adds a new transaction to the pending list.
- `isChainValid()`: Checks the entire chain's integrity, verifying hashes, links, and transaction signatures.
- `getBalanceOfAddress(address)`: Calculates the balance based on the transaction history.

### 3. `Transaction` (`src/transaction.ts`)
Handles individual transfers.
- `signTransaction(signingKey)`: Signs the transaction with a private key.
- `isValid()`: Verifies the cryptographic signature of the transaction.

## Development Workflow & Validation

To maintain code quality and prevent broken code from being committed:
- **Pre-commit Validation**: Run `npm run precommit` before any commit. This script performs:
  1. TypeScript type checking (`npx tsc --noEmit`).
  2. Unit tests execution (`npx jest`).

## Installed Skills (Contextual Guidance)
This project uses specialized skills located in `.agents/skills/`. AI agents MUST prioritize the instructions and best practices provided by these skills:
- **`architecture-patterns`**: Guides the implementation of scalable and clean architecture.
- **`nodejs-backend-patterns`**: Best practices for Node.js backend development.
- **`nodejs-best-practices`**: General security and performance guidelines for Node.js.
- **`typescript-advanced-types`**: Advanced typing patterns for a robust codebase.

## Guidelines for AI Agents
- **Never commit broken code**: Always run `npm run precommit` before committing.
- **Conventional Commits**: Follow the `feat:`, `fix:`, `chore:`, etc., naming convention.
- **Security**: Ensure all transactions are signed and validated. Do not bypass the `isValid()` checks.
- **Async Safety**: Most operations are synchronous for simplicity, but be mindful of CPU-intensive mining tasks.
