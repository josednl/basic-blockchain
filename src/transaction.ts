import { ec as EC } from 'elliptic';
const ec = new EC('secp256k1');

export class Transaction {
  public signature?: string;

  constructor(
    public fromAddress: string | null,
    public toAddress: string,
    public amount: number
  ) {}

  /**
   * Returns the SHA256 hash of the transaction.
   * This hash is what will be signed by the private key.
   */
  public calculateHash(): string {
    return require('crypto')
      .createHash('sha256')
      .update(this.fromAddress + this.toAddress + this.amount)
      .digest('hex');
  }

  /**
   * Signs a transaction with the given signingKey (which contains the public/private key pair).
   * It first checks if the public key matches the fromAddress of the transaction.
   */
  public signTransaction(signingKey: EC.KeyPair): void {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You cannot sign transactions for other wallets!');
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.signature = sig.toDER('hex');
  }

  /**
   * Checks if the signature is valid (transaction has not been tampered with).
   * It uses the fromAddress as the public key.
   */
  public isValid(): boolean {
    // If the transaction is from the null address, it's a mining reward and considered valid
    if (this.fromAddress === null) return true;

    if (!this.signature || this.signature.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
