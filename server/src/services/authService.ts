// services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User'; 
import * as jsrsasign from 'jsrsasign';
import * as crypto from 'crypto';

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService;

  private privateKeyPem: string;
  private publicKeyPem: string;

  private constructor() {
    // 生成 RSA 密钥对
    const keyPair = jsrsasign.KEYUTIL.generateKeypair('RSA', 2048);
    this.privateKeyPem = jsrsasign.KEYUTIL.getPEM(keyPair.prvKeyObj, 'PKCS1PRV');
    this.publicKeyPem = jsrsasign.KEYUTIL.getPEM(keyPair.pubKeyObj, 'PKCS8PUB');
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async register(userDetails: Partial<IUser>): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(userDetails.password || '', 10);
    const user = new User({
      username: userDetails.username,
      email: userDetails.email,
      password: hashedPassword,
    });
    return await user.save();
  }

  public getPublicKey(){
    return this.publicKeyPem;
  }

  // 解密会话密钥
  async decryptSessionKey(encryptedSessionKey: string): Promise<string> {
    const rsaPrivateKey = jsrsasign.KEYUTIL.getKey(this.privateKeyPem, 'PKCS1PRV');
    return jsrsasign.KJUR.crypto.Cipher.decrypt(encryptedSessionKey, rsaPrivateKey);
  }

  public async login(req: Request): Promise<{ token: string }> {
    if (!User) {
      throw new Error('User is not defined')
    }
    const { encryptedSessionKey, encryptedPassword, iv, username } = req.body;

    // 解密会话密钥
    const sessionKey = await this.decryptSessionKey(encryptedSessionKey);

    // 解密密码
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(sessionKey), Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(Buffer.from(encryptedPassword, 'base64'));
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const password = decrypted.toString();

    const user = await User.findOne({ username: username }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
    return { token };
  }

  public authenticateToken(token: string | undefined): Promise<IUser | null> {
    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error('Unauthorized'));
      }

      jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          const user = await User.findById(decoded.userId);
          resolve(user);
        }
      });
    });
  }
}