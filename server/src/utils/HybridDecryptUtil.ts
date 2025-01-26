import * as crypto from 'crypto';

class HybridDecryptUtil {

    // 生成 RSA 密钥对
    generateKeyPair(): { publicKey: any, privateKey:any } {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048
        });

        return { publicKey, privateKey };
    }

    // 导入私钥
    importPrivateKey(privateKeyPem: any): string {
        return privateKeyPem.export({ type: 'pkcs8', format: 'pem' })
    }

    importPubliceKey(publicKeyPem: any): string {
        return publicKeyPem.export({ type: 'spki', format: 'pem' })
    }

    // 解密会话密钥
    decryptSessionKey(encryptedSessionKey: string, privateKeyPem: string): string {
        const privateKeyObject = crypto.createPrivateKey({ key: privateKeyPem, format: 'pem', type: 'pkcs8' });
        const decryptedSessionKeyBuffer = crypto.privateDecrypt(
            {
                key: privateKeyObject,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256'
            },
            Buffer.from(encryptedSessionKey, 'base64')
        );

        const result = decryptedSessionKeyBuffer.toString('ascii');
        return result
    }

    // 解密加密的数据
    decryptData(encryptedData: string, iv: string, sessionKey: string): string {
        if (sessionKey.length !== 64) {
            throw new Error(`Invalid session key length: ${sessionKey.length}`);
        }
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(sessionKey, 'hex'), Buffer.from(iv, 'hex'));
        let decrypted = decipher.update(Buffer.from(encryptedData, 'hex'));
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    decryptCredentials(req: object, privateKey: string): Credentials {
        const {encryptedData, iv, encryptedSessionKey} = req
        const decryptedSessionKey = this.decryptSessionKey(encryptedSessionKey, privateKey);

        // 解密加密的数据
        const decryptedData = this.decryptData(encryptedData, iv, decryptedSessionKey);
        const result = JSON.parse(decryptedData)
        return {
            username: result.username,
            password: result.password,
            email: result.email
        }
    }

    // 解密会话密钥
    

}

interface Credentials {
    username: string;
    password: string;
    email: string|undefined
}

export default HybridDecryptUtil;