import * as crypto from 'crypto';

class HybridEncryptDecryptUtil {
  // 生成 RSA 密钥对
  generateKeyPair(): { publicKey: string, privateKey: string } {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return { publicKey, privateKey };
  }

  // 导入公钥
  importPublicKey(publicKeyPem: string): crypto.KeyObject {
    return crypto.createPublicKey({ key: publicKeyPem, format: 'pem', type: 'spki' });
  }

  // 导入私钥
  importPrivateKey(privateKeyPem: string): crypto.KeyObject {
    return crypto.createPrivateKey({ key: privateKeyPem, format: 'pem', type: 'pkcs8' });
  }

  // 生成 AES 会话密钥
  generateSessionKey(): Buffer {
    return crypto.randomBytes(32); // 256-bit key
  }

  // 加密凭证（前端部分）
  async encryptCredentials(credentials: object, publicKey: crypto.KeyObject): Promise<EncryptedData> {
    const sessionKey = this.generateSessionKey();
    const iv = crypto.randomBytes(12); // GCM 模式推荐 96 比特 IV
    const dataBuffer = Buffer.from(JSON.stringify(credentials));

    // 使用 AES-GCM 加密数据
    const cipher = crypto.createCipheriv('aes-256-gcm', sessionKey, iv);
    const cipherText = Buffer.concat([cipher.update(dataBuffer), cipher.final()]);
    const authTag = cipher.getAuthTag();

    // 使用 RSA-OAEP 加密会话密钥
    const encryptedSessionKey = crypto.publicEncrypt(publicKey, sessionKey);

    return {
      encryptedSessionKey: encryptedSessionKey.toString('hex'),
      iv: iv.toString('hex'),
      cipherText: cipherText.toString('hex'),
      authTag: authTag.toString('hex')
    };
  }

  // 解密凭证（后端部分）
  decryptCredentials(encryptedData: EncryptedData, privateKey: crypto.KeyObject): Credentials {
    const encryptedSessionKey = Buffer.from(encryptedData.encryptedSessionKey, 'hex');
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const cipherText = Buffer.from(encryptedData.cipherText, 'hex');
    const authTag = Buffer.from(encryptedData.authTag, 'hex');

    // 使用 RSA-OAEP 解密会话密钥
    const sessionKey = crypto.privateDecrypt(privateKey, encryptedSessionKey);

    // 使用 AES-GCM 解密数据
    const decipher = crypto.createDecipheriv('aes-256-gcm', sessionKey, iv);
    decipher.setAuthTag(authTag);
    const decryptedData = Buffer.concat([decipher.update(cipherText), decipher.final()]);

    const credentialsString = decryptedData.toString('utf-8');
    const credentials = JSON.parse(credentialsString) as Credentials;

    return credentials;
  }
}

interface EncryptedData {
  encryptedSessionKey: string;
  iv: string;
  cipherText: string;
  authTag: string;
}

interface Credentials {
  username: string;
  password: string;
}

export default HybridEncryptDecryptUtil;