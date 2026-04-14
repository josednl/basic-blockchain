import * as crypto from 'crypto';

export class Block {
  public hash: string;

  constructor(
    public index: number,
    public timestamp: number,
    public data: any,
    public previousHash: string = ''
  ) {
    this.hash = this.calculateHash();
  }

  public calculateHash(): string {
    const dataString = JSON.stringify(this.data);
    return crypto
      .createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + dataString)
      .digest('hex');
  }
}
