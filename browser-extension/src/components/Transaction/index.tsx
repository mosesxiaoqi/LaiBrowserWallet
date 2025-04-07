import { useState } from "react";
import { laiSendTransaction } from "../../hooks/transaction";
import { parseEther, Account, Address } from "viem"; // 假设使用viem库进行单位转换

interface TransactionComponentProps {
  fromAddress: Account;
  balance: bigint;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransactionComponent({
  fromAddress,
  balance,
  onClose,
  onSuccess,
}: TransactionComponentProps) {
  // 交易参数状态
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState(fromAddress || "");
  const [walletBalance, setWalletBalance] = useState<bigint>(
    balance || BigInt(0),
  );
  // UI状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);

  // 可以在组件挂载时获取当前连接的钱包地址和余额
  // useEffect(() => {
  //   async function fetchWalletInfo() {
  //     // 获取钱包地址和余额的代码
  //     const walletAddress = "0x..."; // 替换为实际获取地址的代码
  //     const walletBalance = BigInt(...); // 替换为实际获取余额的代码
  //     setAddress(walletAddress);
  //     setBalance(walletBalance);
  //   }
  //   fetchWalletInfo();
  // }, []);

  const handleSubmit = async () => {
    if (!recipient || !amount || !address) {
      setError("请填写所有必填字段");
      setShowErrorModal(true);
      return;
    }

    try {
      // 将ETH金额转换为Wei (bigint)
      const valueInWei = parseEther(amount);

      // 调用交易处理函数
      await handleSendTransaction(
        recipient, // to地址
        valueInWei, // 金额(Wei)
        address, // 发送方地址
        "ethereum", // 链类型
        walletBalance, // 账户余额
      );
    } catch (err) {
      setError("金额格式无效或其他错误");
      setShowErrorModal(true);
    }
  };

  const handleSendTransaction = async (
    to: string,
    value: bigint,
    laiAddress: Account,
    chain: "ethereum",
    walletBalance: bigint,
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const hash = await laiSendTransaction(
        to,
        value,
        laiAddress,
        chain,
        walletBalance,
      );
      setTxHash(hash);

      // 如果交易成功且提供了onSuccess回调，则调用它
      if (hash && onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 3000); // 显示成功消息3秒后关闭
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        // 处理非Error类型的错误
        setError(String(err));
      }
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transaction-form max-w-md mx-auto p-6 bg-white rounded shadow">
      <div className="space-y-6">
        {" "}
        {/* 增加了间距从 space-y-4 到 space-y-6 */}
        <div className="flex flex-col w-full">
          {/* <label
            htmlFor="recipient"
            className="text-sm font-medium mb-2 h-5 block w-20 text-left" // 添加 text-left 确保对齐
            style={{ width: "80px" }} // 内联样式作为备用
          >
            接收地址
          </label> */}
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col w-full">
          {" "}
          {/* 保持与上面的结构一致 */}
          {/* <label
            htmlFor="amount"
            className="text-sm font-medium mb-2 h-5 block w-20 text-left" // 保持一致
            style={{ width: "80px" }} // 内联样式作为备用
          >
            金额 (ETH)
          </label> */}
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            type="number"
            step="0.0001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600 mt-6">
        {" "}
        {/* 增加了 mt-6 与上面保持一致间距 */}
        当前钱包: {address.address || "未连接"}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleSubmit}
          disabled={isLoading || !address.address}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-300"
        >
          {isLoading ? "交易处理中..." : "发送交易"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          取消
        </button>
      </div>

      {showErrorModal && (
        <div className="error-modal mt-4 p-4 bg-red-100 text-red-700 rounded">
          <h3 className="font-semibold">交易失败</h3>
          <p>{error}</p>
          <button
            onClick={() => setShowErrorModal(false)}
            className="mt-2 text-sm underline"
          >
            关闭
          </button>
        </div>
      )}

      {txHash && (
        <div className="success-message mt-4 p-4 bg-green-100 text-green-700 rounded">
          <p>交易已提交！交易哈希: {txHash}</p>
        </div>
      )}
    </div>
  );
}
