import * as crypto from 'crypto';
class HybridEncryptUtil {
  // 导入公钥
  importPublicKey(publicKeyPem: string): crypto.KeyObject {
    return crypto.createPublicKey({ key: publicKeyPem, format: 'pem', type: 'spki' });
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
  };
}

interface EncryptedData {
  encryptedSessionKey: string;
  iv: string;
  cipherText: string;
  authTag: string;
}

export default HybridEncryptUtil;