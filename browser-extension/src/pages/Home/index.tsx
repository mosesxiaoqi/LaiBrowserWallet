import { useMemo, useState, useEffect } from "react";

import { Keypair } from "@solana/web3.js";
import Big from "big.js";
// import { privateKeyToAccount } from "viem/accounts";

import { Box } from "../../components/Box";
import { IconButton, IconButtonKey } from "../../components/IconButton";
import { Text } from "../../components/Text";
import { Token } from "../../components/Token";
import { Zorb } from "../../components/Zorb";
import { useBalance } from "../../hooks/useBalance";
import { AccountUtil } from "../../utils/AccountUtil";
import { HelperUtil } from "../../utils/HelperUtil";
import { NetworkSelector } from "../../components/Network/NetworkSelector";
import { getWalletaddress } from "../../core/create/create_local_wallet";
import { switchChain } from "../../core/create/create_mnemonics";

// // EVM
// const { address } = await getWalletaddress();

// Solana
const keypair = Keypair.fromSecretKey(AccountUtil.privateKeySolana);
const publicKey = keypair.publicKey;

export function Home() {
  // 跟踪地址是否已复制
  const [copied, setCopied] = useState(false);
  // 当前显示的区块链网络
  const [page, setPage] = useState<"ethereum" | "solana">("ethereum");

  const [evmAddress, setEvmAddress] = useState(""); // 存储EVM地址
  const [isLoading, setIsLoading] = useState(true); // 添加加载状态

  // 获取钱包地址
  useEffect(() => {
    async function fetchAddress() {
      try {
        const { addresses, walletName } = await getWalletaddress();
        console.log("获取钱包:", addresses[0]);
        setEvmAddress(addresses[0]);
      } catch (error) {
        console.error("获取钱包地址失败:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAddress();
  }, []);

  // 判断当前是否为以太坊网络
  const isEVM = page === "ethereum"; //isEVM 是一个布尔值 (true 或 false)   // 仅当 page 为 'ethereum' 时，isEVM 才是 true
  // 获取当前网络对应的账户地址
  const account = isEVM ? evmAddress : publicKey.toString();
  console.log("evm钱包:", evmAddress);
  console.log("当前钱包:", account);

  // ?? 是 JavaScript 的 空值合并运算符。
  // 当 page 为 null 或 undefined 时，返回 'ethereum' 作为默认值。
  const balance = useBalance(page ?? "ethereum", account);
  // eslint-disable-next-line new-cap
  const formattedBalance = Big(balance).round(4).toString(); //Big.js 是一个高精度的数学库，适用于 处理大数 和 避免浮点数误差

  // 状态管理
  const [selectedNetwork, setSelectedNetwork] = useState(1);

  // 网络变更处理函数
  const handleNetworkChange = (networkId: number) => {
    setSelectedNetwork(networkId);
    console.log(`网络已切换到: ${networkId}`);
    // 这里可以添加其他网络切换相关逻辑，如连接到新网络
    switchChain(networkId);
  };

  // 仅在 isEVM 或 copied 变化时 重新计算 iconOptions，避免不必要的重渲染
  const iconOptions = useMemo(
    () => ({
      // 如果 copied === true，则键名为 "checkmark"，否则 "copy"
      [copied ? "checkmark" : "copy"]: {
        label: "Copy",
        onClick: async () => {
          setCopied(true); //// 设为已复制状态
          navigator.clipboard
            .writeText(account)
            .then(() => {
              // alert("successfully copied");
            })
            .catch(() => {
              alert("something went wrong");
            }); // 复制地址到剪贴板
          // 验证复制是否成功
          // const clipboardText = await navigator.clipboard.readText();
          // console.log("剪贴板内容:", clipboardText);
          // console.log("是否匹配:", clipboardText === account);
          setTimeout(() => setCopied(false), 1500); // 1.5秒后取消 "已复制" 状态
        },
      },
      swap: {
        label: "Swap",
        onClick: () => {
          // 如果 isEVM === true（当前是 Ethereum）
          // 如果 isEVM === false（当前是 Solana）
          setPage(isEVM ? "solana" : "ethereum"); //在 Ethereum 和 Solana 之间切换。
          //setPage() 可能是一个 useState 钩子，用于 切换 UI。
        },
      },
      /**打开区块链浏览器（Etherscan 或 Solana Explorer）。
	    	_blank：在新标签页打开 account 的页面。 */
      send: {
        label: "Send",
        onClick: () => {
          // window.open(
          //   isEVM
          //     ? `https://etherscan.io/address/${account}`
          //     : `https://explorer.solana.com/address/${account}`,
          //   "_blank",
          // );
        },
      },
      buy: {
        label: "Buy",
        onClick: () => {
          window.open(
            isEVM
              ? `https://etherscan.io/address/${account}`
              : `https://explorer.solana.com/address/${account}`,
            "_blank",
          );
        },
      },
    }),
    [isEVM, copied, account],
  );

  return (
    // 顶部容器
    <Box
      height="full"
      width="full"
      display="flex"
      // 在交叉轴上居中对齐所有子元素
      /*
      **`column` 布局 + `alignItems="center"` (水平居中):**
      ```
      +------------------+
      |                  |
      |      元素1       |
      |                  |
      |      元素2       |
      |                  |
      |      元素3       |
      |                  |
      +------------------+
      ```
      */
      alignItems="center"
      /*
      ***列布局 (`column`):**
      ```
      +------------------+
      |                  |
      | 元素1            |
      |                  |
      | 元素2            |
      |                  |
      | 元素3            |
      |                  |
      +------------------+
      ```
      */
      flexDirection="column"
      // 设置容器背景色为黑色
      background="black"
      // 设置文字默认颜色为白色
      // 子元素会继承这个颜色除非被覆盖
      color="white"
      // 设置上内边距为 12 个单位(可能是像素或设计系统中的尺寸单位)
      paddingTop="12"
      // 设置左右内边距为 5 个单位，使内容不会紧贴容器边缘
      paddingX="5"
    >
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="full"
        >
          <Text>加载钱包地址中...</Text>
        </Box>
      ) : (
        <>
          <NetworkSelector
            currentNetwork={selectedNetwork}
            onNetworkChange={handleNetworkChange}
          />
          <Box
            width="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap="8"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
              gap="4"
            >
              <Zorb />
              <Text as="h1" textAlign="center" fontSize="18" color="white">
                {/* 显示缩短的地址 */}
                {HelperUtil.shortenAddress(account)}
              </Text>
              <Box display="flex" alignItems="center" gap="4">
                {Object.entries(iconOptions).map(
                  ([icon, { label, onClick }]) => (
                    <IconButton
                      key={icon}
                      label={label}
                      onClick={onClick}
                      icon={icon as IconButtonKey}
                    />
                  ),
                )}
              </Box>
            </Box>

            <Token
              token={isEVM ? "ethereum" : "solana"}
              balance={formattedBalance}
            />
          </Box>
        </>
      )}
    </Box>
  );
}
