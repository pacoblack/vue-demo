import forge from 'node-forge';
import CryptoJS from 'crypto-js';
class HybridEncryptUtil {

  // 加密凭证（前端部分）
  async encryptCredentials(credentials: object, publicKeyOrigin: string): Promise<EncryptedData> {
    const publicKeyClear= publicKeyOrigin.replace(/[\r\n]/g, '')
    const publicKey = forge.pki.publicKeyFromPem(publicKeyClear);

    // 生成随机会话密钥和IV
    const sessionKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex); // AES-256需要32字节的密钥
    const iv = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex); // IV长度应为16字节

    // 使用公钥加密会话密钥并编码为Base64
    const encryptedSessionKeyBytes = publicKey.encrypt(sessionKey, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
      mgf: forge.mgf.mgf1.create(forge.md.sha256.create()) // 确保使用相同的MGF
    });

    const encryptedSessionKey = forge.util.encode64(encryptedSessionKeyBytes);

    const credentialsJson = JSON.stringify(credentials);
    // 使用会话密钥加密密码
    const cipher = CryptoJS.AES.encrypt(credentialsJson, CryptoJS.enc.Hex.parse(sessionKey), {
      iv: CryptoJS.enc.Hex.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return {
      encryptedData: cipher.ciphertext.toString(CryptoJS.enc.Hex),
      iv: iv,
      sessionKey: sessionKey,
      encryptedSessionKey: encryptedSessionKey
    };
  };
}

interface EncryptedData {
  encryptedSessionKey: any;
  iv: any;
  encryptedData: any;
  sessionKey: any;
}

export default HybridEncryptUtil;