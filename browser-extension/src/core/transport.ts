// 从 wagmi 获取 publicClient（公共 RPC 客户端）。
// 这个客户端用于读取区块链数据，如余额、交易状态等。
// 适用于 无需私钥 的读取操作。
import { getPublicClient } from "@wagmi/core";
// EIP1193Parameters： EIP-1193 规范的JSON-RPC 请求参数类型
// EIP1193Provider： EIP-1193兼容的Provider接口
// createWalletClient： 创建钱包客户端， 带私钥，用于签名
// fromHex, toHex ： 将hex数据转换为数字或字符串
import {
  EIP1193Parameters,
  EIP1193Provider,
  createWalletClient,
  fromHex,
  http,
  toHex,
} from "viem";
// privateKeyToAccount： 从私钥生成钱包账户
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";

// AccountUtil： 获取以太坊或者Solana的私钥
import { AccountUtil } from "../utils/AccountUtil";
// ChainId： 链ID
// wagmiConfig： wagmi配置对象
import { ChainId, wagmiConfig } from "./wagmi";
import { getAccount } from "./create/create_local_wallet";
import { getWalletClient } from "./create/create_mnemonics";
import { showConnectDialog } from "../utils/showConnectDialog";

// -- Constants -----------------------------------------------------------------
// 对象定义了 两个键名，用于存储钱包的状态信息
const LOCAL_STORAGE_KEYS = {
  HAS_CONNECTED: "@appkit/extension_connected", //记录钱包是否已经连接
  CHAIN_ID: "@appkit/extension_chain_id", //记录当前连接的区块链id
};

// createReownTransport返回一个包含send方法的对象
export function createReownTransport() {
  return {
    send: async ({
      method,
      params,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: EIP1193Parameters<any>): Promise<
      ReturnType<EIP1193Provider["request"]>
    > => {
      console.log(`[ReownTransport] 接收到调用: ${method}`, params);
      // 通过私钥获得账户
      const account = privateKeyToAccount(AccountUtil.privateKeyEvm);
      console.log("获取的账户地址是", account.address);
      if (!account) {
        throw new Error("Account not found");
      }
      // signMessage() 用于用私钥对消息进行签名（EIP-191 签名）
      // signTypedData() 用于对 EIP-712 结构化数据进行签名
      // 额外的： signTransaction() 用于离线签名交易  sendTransaction() 直接发送交易
      const { address, signMessage, signTypedData } = account;

      // sendTransaction() 直接发送交易
      const { sendTransaction } = getWalletClient();
      /*
      代码的作用是：
	    1.	从 localStorage 读取 CHAIN_ID 的值
	    2.	尝试将其转换为 ChainId 类型
	    3.	如果 localStorage 没有 CHAIN_ID，默认使用 '1'（Ethereum 主网 ID）
      */
      const chainId =
        (localStorage.getItem(LOCAL_STORAGE_KEYS.CHAIN_ID) as ChainId | null) ??
        "1";
      // 用于 从 localStorage 读取 HAS_CONNECTED 这个键的值，判断用户是否曾经连接过钱包
      const hasConnected = localStorage.getItem(
        LOCAL_STORAGE_KEYS.HAS_CONNECTED,
      );

      const publicClient = getPublicClient(wagmiConfig, {
        chainId: chainId as ChainId,
      });

      switch (method) {
        case "eth_chainId":
          return toHex(Number(chainId));

        case "eth_estimateGas": {
          const gas = await publicClient.estimateGas(params[0]);

          return toHex(gas);
        }

        case "eth_blockNumber": {
          const blockNumber = await publicClient.getBlockNumber();

          return toHex(blockNumber);
        }
        /**
         * // 定义 `eth_call` 需要的参数
              const callData = {
                to: '0xContractAddress', // 目标智能合约地址
                data: '0xFunctionCallData' // 需要执行的合约方法
              };

              // 执行 `eth_call`
              const result = await publicClient.call(callData);
         */
        // eth_call 是以太坊 JSON-RPC 方法，用于在本地执行智能合约调用，不需要支付 gas，不会在区块链上产生交易
        // 运行合约的 view / pure 方法（不会修改链上数据）
        // publicClient.call() 是 viem 的封装方法，它内部使用 eth_call，但提供了更简洁的 API。
        case "eth_call":
          console.log("执行eth call");
          return publicClient.call({
            to: params[0].to,
            data: params[0].data,
          });

        case "wallet_revokePermissions": {
          const [{ parentCapability }] = params;
          if (parentCapability === "eth_accounts") {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.HAS_CONNECTED);
            return null;
          }
          throw new Error(`Unsupported capability: ${parentCapability}`);
        }

        case "wallet_requestPermissions": {
          console.log("dapp 请求连接");
          const confirmed = await showConnectDialog(); // 弹窗请求连接
          if (!confirmed) throw new Error("用户拒绝连接");

          localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_CONNECTED, "true");

          return [
            {
              parentCapability: "eth_accounts",
              caveats: [
                {
                  type: "filterResponse",
                  value: [address],
                },
              ],
            },
          ];
        }
        case "eth_requestAccounts": {
          console.log("dapp 请求连接");
          const confirmed = await showConnectDialog(); // 弹窗
          if (!confirmed) throw new Error("用户拒绝连接");
          localStorage.setItem(LOCAL_STORAGE_KEYS.HAS_CONNECTED, "true");

          return [address];
        }

        case "eth_accounts":
          return [address];

        // wallet_switchEthereumChain 是 EIP-3326 定义的方法，用于让 DApp 请求用户的钱包切换网络
        case "wallet_switchEthereumChain":
          localStorage.setItem(
            LOCAL_STORAGE_KEYS.CHAIN_ID,
            fromHex(params[0].chainId, "number").toString(), //将 chainId 从十六进制转换为十进制字符串
          );

          return null;

        case "personal_sign": {
          const [message] = params;

          return signMessage?.({
            message: { raw: message },
          });
        }

        case "eth_sendTransaction": {
          const [{ to, value }] = params;

          const hash = await sendTransaction({
            account: address as `0x${string}`,
            to,
            value: BigInt(value),
            chain: null,
          });

          return hash;
        }

        case "eth_signTypedData_v4": {
          const [, typedData] = params;

          return signTypedData?.(JSON.parse(typedData));
        }

        default:
          console.log("dapp 请求", method);
          throw new Error(`Method not implemented: ${method}`);
      }
    },
  };
}
