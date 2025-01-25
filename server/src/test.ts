import HybridEncryptDecryptUtil from './utils/HybridEncryptDecryptUtil';

async function main() {
  const hybridEncryptDecryptUtil = new HybridEncryptDecryptUtil();

  // 生成 RSA 密钥对
  const { publicKey, privateKey } = hybridEncryptDecryptUtil.generateKeyPair();
  console.log('Public Key:', publicKey);
  console.log('Private Key:', privateKey);

  // 要加密的凭据
  const credentials = {
    username: 'user1',
    password: 'password123'
  };

  // 导入公钥并加密凭据
  const importedPublicKey = hybridEncryptDecryptUtil.importPublicKey(publicKey);
  const encryptedData = await hybridEncryptDecryptUtil.encryptCredentials(credentials, importedPublicKey);

  console.log('Encrypted Data:', encryptedData);

  // 导入私钥并解密凭据
  const importedPrivateKey = hybridEncryptDecryptUtil.importPrivateKey(privateKey);
  const decryptedCredentials = hybridEncryptDecryptUtil.decryptCredentials(encryptedData, importedPrivateKey);

  console.log('Decrypted Credentials:', decryptedCredentials);
}

main().catch(console.error);