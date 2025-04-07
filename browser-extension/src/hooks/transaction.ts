import { sepolia, mainnet } from "viem/chains";
import {
  getPublicClient,
  getWalletClient,
  getCurrentChain,
} from "../core/create/create_mnemonics";
import { useQuery } from "@tanstack/react-query";
import { Account, formatEther, parseEther, parseGwei } from "viem";

export async function laiSendTransaction(
  to: string,
  value: bigint,
  laiAddress: Account,
  chain: "ethereum",
  balance: bigint,
) {
  if (!laiAddress || balance < value) {
    throw new Error("余额不足");
    return null;
  }
  try {
    const publicClient = getPublicClient();
    const walletClient = getWalletClient();
    const currentChain = await getCurrentChain();
    if (walletClient === null) {
      throw new Error("钱包客户端未初始化");
    }
    const nonce = await publicClient.getTransactionCount({
      address: laiAddress.address,
    });

    const currentGasPrice = await publicClient.getGasPrice(); // 获取当前 Gas 价格
    const maxFeePerGas = currentGasPrice + parseGwei("5"); // maxFeePerGas 设置为当前 gas + 5 Gwei
    const maxPriorityFeePerGas = parseGwei("2"); // 设置适中的 maxPriorityFeePerGas

    const request = await walletClient.prepareTransactionRequest({
      account: laiAddress,
      to: to as `0x${string}`,
      value: value,
      data: "0x",
      type: "eip1559",
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce: nonce,
      chain: currentChain,
    });
    const gasEstimate = await publicClient.estimateGas(request);
    request.gas = gasEstimate;

    const serializedTransaction = await walletClient.signTransaction(request);
    const transactionHash = await walletClient.sendRawTransaction({
      serializedTransaction,
    });
    return transactionHash;
  } catch (error) {
    console.error("交易失败:", error);
    throw error;
  }
}
