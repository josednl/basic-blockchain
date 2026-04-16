import { Request, Response } from 'express';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

export class WalletController {
  public generateWallet = (req: Request, res: Response) => {
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');

    res.json({
      publicKey,
      privateKey,
      note: 'Keep your private key secret!'
    });
  };
}
