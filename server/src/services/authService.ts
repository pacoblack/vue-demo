// services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import HybridDecryptUtil from '../utils/HybridDecryptUtil';

interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
}

export class AuthService {
  private static instance: AuthService;

  private privateKeyPem: any;
  private publicKeyPem: any;
  private decryptUtil: HybridDecryptUtil;

  private constructor() {
    // 生成 RSA 密钥对
    this.decryptUtil = new HybridDecryptUtil();
    const { publicKey, privateKey } = this.decryptUtil.generateKeyPair();
    this.privateKeyPem = privateKey
    this.publicKeyPem = publicKey
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
    return this.decryptUtil.importPubliceKey(this.publicKeyPem);
  }

  public async login(req: Request): Promise<{ token: string }> {
    if (!User) {
      throw new Error('User is not defined')
    }
    // const { encryptedSessionKey, encryptedPassword, iv, username } = req.body;
    const importedPrivateKey = this.decryptUtil.importPrivateKey(this.privateKeyPem);
    const decryptData = await this.decryptUtil.decryptCredentials(req.body, importedPrivateKey);

    const user = await User.findOne({ username: decryptData.username }).select('+password');
    if (!user || !(await bcrypt.compare(decryptData.password, user.password))) {
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