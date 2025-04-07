import {
  mnemonicToAccount,
  generateMnemonic,
  english,
  privateKeyToAccount,
} from "viem/accounts";
import {
  createWalletClient,
  createPublicClient,
  http,
  WalletClient,
  PublicClient,
  HttpTransport,
  toHex,
} from "viem";
import { mainnet, sepolia, Chain } from "viem/chains";
import CryptoJS from "crypto-js";

/**
 * 根据一下的思路，实现钱包的生成、地址的生成、账户的切换
 *
MetaMask通过递增address_index（地址索引）来生成新账户。例如：

    问题：多平台同步
    - MetaMask支持多平台同步，那么如何确保同步的账户列表是一致的呢？ currentIndex是服务端存储吗？
    - 第一个账户：m/44'/60'/0'/0/0
    - 第二个账户：m/44'/60'/0'/0/1
    - 第三个账户：m/44'/60'/0'/0/2

    具体实现上：
    - 自动递增：MetaMask维护一个内部计数器，记录当前已经生成了多少个账户。每当用户点击“创建新账户”时，计数器加1，然后用新的address_index从助记词推导出对应的私钥和地址。
    - 确定性推导：由于BIP-44是分层确定性（HD）的，只要助记词不变，同一个索引总是生成相同的私钥和地址。这保证了即使钱包被删除，只要重新导入助记词，就能恢复所有账户。

实现思路：
    - 在你的钱包中维护一个变量（比如currentIndex），初始值为0。
    - 每次创建新账户时，递增currentIndex，然后用m/44'/60'/0'/0/currentIndex推导出新地址。
    - 使用确定性推导算法（参考BIP-32），确保同一助记词下生成的地址始终一致

MetaMask不会直接存储所有的私钥，而是通过以下方式管理：
    - 本地存储助记词：MetaMask将加密后的助记词存储在用户设备的本地存储中（比如浏览器的LocalStorage），用用户设置的密码进行加密。
    - 按需推导：每次启动时，MetaMask从助记词和当前已知的address_index重新推导出所有账户的私钥和地址，而不是持久化存储所有私钥。这减少了泄漏风险。
    - 账户元数据：MetaMask会保存账户的地址和一些元数据（如账户名称），但私钥本身是动态生成的。

实现思路：
    - 加密存储助记词：将助记词用用户密码加密后保存到本地（例如JSON文件或数据库）。
    - 动态生成密钥：每次需要使用私钥时，从助记词和对应的address_index实时推导，避免直接存储私钥。
    - 保存地址列表：维护一个账户列表，记录每个账户的地址和索引，方便显示和切换。

MetaMask的账户切换功能依托于它维护的账户列表：
    - 账户列表：MetaMask在界面上显示所有已生成的账户地址，用户可以点击选择某个账户。
    - 当前活动账户：每次切换时，MetaMask更新“当前活动账户”的状态，并将其私钥用于签名交易。
    - 本地状态管理：切换信息存储在本地，钱包会记住用户上次的活动账户。

实现思路：
    - 界面展示：在UI上列出所有账户（地址+名称），让用户选择。
    - 状态管理：增加一个activeAccountIndex变量，记录当前选中的账户索引。
    - 动态加载私钥：切换账户时，根据activeAccountIndex从助记词推导出对应的私钥，用于后续操作。
 */

/**
MetaMask的恢复策略
    MetaMask在恢复时通常会这样做：
        - 默认生成第一个账户：恢复时，总是从m/44'/60'/0'/0/0开始，生成第一个账户（address_index = 0）。
        - 扫描区块链活动：通过连接以太坊节点（通常是通过RPC提供商如Infura），查询每个派生地址是否有交易历史或余额。如果某个地址有活动，就认为它是用户之前创建的账户。
        - 逐步递增索引：从address_index = 0开始，依次检查1、2、3……，直到连续几个地址没有任何链上活动（例如连续5个地址无余额、无交易），然后停止扫描。
        - 用户手动添加：如果用户知道自己创建过更多账户，MetaMask允许手动“创建账户”来继续递增索引，直到恢复所有账户。

    这种策略的核心是借助区块链数据的外部查询，而不是仅依赖本地信息
    注意事项
        - 性能问题：扫描区块链可能较慢，尤其是如果用户创建了很多账户。可以通过并行查询多个地址来优化。
        - 隐私问题：通过外部节点查询可能会暴露用户地址，建议让用户选择可信的RPC节点，或者提供离线恢复选项。
        - 未使用但已创建的账户：如果某个账户被创建但从未使用（无链上活动），这种方法无法检测到。这时需要依赖用户手动添加账户，或者在创建时额外备份账户数量（例如通过加密文件存储currentIndex）。
        - 多链支持：如果你的钱包支持多条链（例如ETH和BSC），需要为每条链分别扫描（调整coin_type，如ETH用60'，BSC用571'）。

    替代方案
        如果不想完全依赖区块链扫描，可以考虑以下改进：
        - 备份元数据：在创建账户时，将当前的currentIndex和账户列表加密后保存到用户设备（或云端）。恢复时直接读取这个元数据。
        - 用户输入：提示用户输入他们记得的账户数量，作为恢复的起点。
        - 默认生成多个：恢复时默认生成10个账户（address_index从0到9），然后让用户手动添加更多

    去中心化钱包（如MetaMask）在恢复时会通过以下步骤获取代币信息：
        - 生成地址：从助记词按BIP-44路径（例如m/44'/60'/0'/0/index）推导出所有账户的地址。
        - 查询区块链：连接区块链节点（通过RPC提供商如Infura或Alchemy），查询每个地址的余额和代币持有情况。
        - 区分代币类型：
        - 原生代币（如ETH）：直接查询地址的余额。
        - ERC-20代币（如USDT、DAI）：查询每个代币合约的balanceOf方法，传入目标地址。

        由于区块链是账户余额的唯一真相来源，恢复时必须实时从链上获取这些数据
 */

// export const currentIndexPath = 'currentIndex.json';
// export const walletMnemonicPath = 'wallet-data.json';

export async function getCurrentIndex(): Promise<number> {
  try {
    const walletIndexStr = localStorage.getItem("laiWalletCurrentIndex")!;

    const walletIndex = Number(walletIndexStr);
    if (isNaN(walletIndex)) {
      return 0; // 如果没有找到，返回默认值
    }
    return walletIndex;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

async function setCurrentIndex(currentIndex: number) {
  // 保存 currentIndex 到文件
  localStorage.setItem("laiWalletCurrentIndex", currentIndex.toString());
  console.log("currentIndex saved");
}

export async function getWalletName(): Promise<string> {
  try {
    const walletName = localStorage.getItem("laiWalletName")!;
    return walletName;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

export async function saveWalletName(walletName: string) {
  // 保存钱包名称
  localStorage.setItem("laiWalletName", walletName);
  console.log("walletName saved");
}

export function getMnemonic() {
  // 1. 生成或使用已有的助记词
  // 生成新助记词（12 或 24 个单词）
  const mnemonic = generateMnemonic(english);
  console.log("mnemonic: ", mnemonic);
  return mnemonic;
}

// 加密助记词
export function encryptMnemonic(mnemonic: string, password = "aabb") {
  const encrypted = CryptoJS.AES.encrypt(mnemonic, password).toString();
  console.log("encrypted: ", encrypted);
  return encrypted;
}

// 解密助记词
// 先随便使用默认密码，后续可以改成用户输入的密码
export function decryptMnemonic(encryptedMnemonic: string, password = "aabb") {
  const bytes = CryptoJS.AES.decrypt(encryptedMnemonic, password);
  const decryptedMnemonic = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMnemonic;
}

//加密保存
export async function saveEncryptedMnemonic(encryptedMnemonic: string) {
  // 存储助记词
  localStorage.setItem("laiWalletEncryptedMnemonic", encryptedMnemonic);
  console.log("Encrypted mnemonic saved");
} // 保存 saveEncryptedMnemonic(encryptedMnemonic);

//加载助记词
export async function loadEncryptedMnemonic() {
  try {
    const encryptedMnemonic = localStorage.getItem(
      "laiWalletEncryptedMnemonic",
    )!;
    if (encryptedMnemonic === null) {
      throw new Error("No wallet found");
    }
    return encryptedMnemonic;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
} // 读取 const loadedEncryptedMnemonic = loadEncryptedMnemonic();

// 3. 定义生成地址的函数
export function generateAccount(mnemonic: string, addressIndex = 0) {
  // 构造 BIP-44 路径：m/44'/60'/account'/0/addressIndex
  const path = `m/44'/60'/0'/0/${addressIndex}` as `m/44'/60'/${string}`;

  const account = mnemonicToAccount(mnemonic, { path });
  // console.log("私钥", toHex(account.getHdKey().privateKey!));
  // const account1 = privateKeyToAccount(
  //   "0x758a564d4775fdcf2e2dae31f14eef6c31f1afd3f8abe5bad42f289ab4a6a3e0",
  // );
  // console.log("地址", account1.address);
  return account;
}

export async function generateAddress(mnemonic: string) {
  const addressIndex = await getCurrentIndex();
  console.log("addressIndex: ", addressIndex);
  const account = generateAccount(mnemonic, addressIndex);
  // 生成钱包数量值➕1在保存
  setCurrentIndex(addressIndex + 1);
  return account.address;
}

const transports: Record<number, string> = {
  [mainnet.id]: "https://rpc.payload.de",
  [sepolia.id]: "https://1rpc.io/sepolia",
};

const chainMap: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [sepolia.id]: sepolia,
};
let laiWalletClient: WalletClient | null = null;
let laiPublicCClient: PublicClient | null = null;
let currentChain: Chain = sepolia;
let currentTransportConfig = { url: transports[currentChain.id] }; // 默认使用http默认URL
// m/44'/60'/1'/0/0
// 5. （可选）创建钱包客户端，用于与区块链交互

// 获取全局 WalletClient（确保单例）
export function getWalletClient(): WalletClient {
  if (!laiWalletClient) {
    laiWalletClient = createWalletClient({
      //由于账户可能会更换，因此在钱包的前端更换账户时，发生变化的是当前活动账户的私钥，而不是整个钱包的私钥。因此，钱包客户端应该支持动态切换私钥。
      //在交易时要指定当前活动账户
      chain: currentChain,
      transport: http(currentTransportConfig.url),
    });
  }
  return laiWalletClient;
}

export function getPublicClient(): PublicClient {
  if (!laiPublicCClient) {
    laiPublicCClient = createPublicClient({
      chain: currentChain,
      transport: http(currentTransportConfig.url),
    });
  }
  return laiPublicCClient;
}

// 函数：根据需求动态切换链
export async function switchChain(newChain: number) {
  currentTransportConfig.url = transports[newChain] ?? null;
  if (currentTransportConfig.url === null) {
    return false;
  }
  laiWalletClient = createWalletClient({
    chain: chainMap[newChain], // 动态设置新的链
    transport: http(currentTransportConfig.url), // 保持当前 transport
  });

  laiPublicCClient = createPublicClient({
    chain: chainMap[newChain],
    transport: http(currentTransportConfig.url),
  });

  currentChain = chainMap[newChain];

  return true;
}

export async function getCurrentChain() {
  return currentChain;
}

export async function getChains() {
  return Object.keys(transports).map((id) => ({
    id: Number(id),
    chain: chainMap[Number(id)],
  }));
}
