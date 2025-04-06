import * as mnemonic from "./create_mnemonics";

// 检查是否创建了钱包
export async function checkWalletCreated() {
  const isInitialized = localStorage.getItem("laiWalletInitialized") === "true";
  if (!isInitialized) {
    return false; // 钱包尚未初始化
  }
  return true; // 钱包已初始化
}

export async function setWalletInitialized() {
  localStorage.setItem("laiWalletInitialized", "true");
}

export function createWallet(password: string) {
  // 1. 生成或使用已有的助记词
  const wallet_mnemonic = mnemonic.getMnemonic();
  // 2. 加密助记词
  const encryptedMnemonic = mnemonic.encryptMnemonic(wallet_mnemonic, password);
  // 3. 保存加密后的助记词
  mnemonic.saveEncryptedMnemonic(encryptedMnemonic);

  const address = mnemonic.generateAddress(wallet_mnemonic);

  return {
    mnemonic: wallet_mnemonic,
    address: address,
  };
}

export async function getWalletaddress() {
  // 读取现有的 currentIndex，若文件不存在则使用默认值
  let currentIndex = await mnemonic.getCurrentIndex();
  const encryptedMnemonic = await mnemonic.loadEncryptedMnemonic();
  if (encryptedMnemonic === null) {
    throw new Error("No wallet found");
  }
  const wallet_mnemonic = mnemonic.decryptMnemonic(encryptedMnemonic);
  const addresses: string[] = [];
  for (let i = 0; i < currentIndex; i++) {
    const account = mnemonic.generateAccount(wallet_mnemonic, i);
    console.log(`Wallet ${i + 1}: ${account.address}`);
    addresses.push(account.address);
  }
  let walletName = await mnemonic.getWalletName();
  console.log(`Wallet name: ${walletName}`);
  return { addresses, walletName };
}
