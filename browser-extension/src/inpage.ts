import { registerWallet } from "@wallet-standard/core";
import { announceProvider } from "mipd"; //announceProvider → EIP-6963 规范的方法，用于广播 EVM 兼容的钱包，使 DApp 发现 window.ethereum
import { v4 as uuidv4 } from "uuid"; //uuidv4() → 生成一个唯一的 UUID，用于标识该钱包实例。

import { EvmProvider } from "./core/EvmProvider";
import { SolanaProvider } from "./core/SolanaProvider";
import { ConstantsUtil } from "./utils/ConstantsUtil";

const evmProvider = new EvmProvider();
const solanaProvider = new SolanaProvider();

// 扩展 evmProvider，让它支持 permissions 方法
(evmProvider as any).requestPermissions = (...args: any[]) => {
  return evmProvider.request({
    method: "wallet_requestPermissions",
    params: args,
  });
};

(evmProvider as any).revokePermissions = (...args: any[]) => {
  return evmProvider.request({
    method: "wallet_revokePermissions",
    params: args,
  });
};

(evmProvider as any).enable = () => {
  return evmProvider.request({ method: "eth_requestAccounts" });
};

announceProvider({
  info: {
    icon: ConstantsUtil.IconRaw,
    name: "LaiWallet",
    rdns: "reown.com",
    uuid: uuidv4(),
  },
  // We can fix type errors by providing all RPC methods to ReownEvmProvider (EIP1193 provider)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  provider: evmProvider,
});

registerWallet(solanaProvider);
