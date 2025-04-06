// `QueryClient` 和 `QueryClientProvider` 是从 `@tanstack/react-query` 库中导入的
// 用于管理和提供数据请求的上下文
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useEffect, useState } from "react";

import { Box } from "./components/Box";
import { Text } from "./components/Text";
// 包含了 `wagmi` 库所需的配置
import { wagmiConfig } from "./core/wagmi";
// 全局的 CSS 样式文件
import "./globals.css";
import { Home } from "./pages/Home";
import { CreateWallet } from "./pages/CreateWallet";
import { checkWalletCreated } from "./core/create/create_local_wallet";

// 管理缓存和数据请求
const queryClient = new QueryClient();

export default function App() {
  // 检查钱包是否已初始化
  const [isWalletInitialized, setIsWalletInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 创建一个内部的异步函数
    const initWallet = async () => {
      // 从本地存储检查钱包是否已初始化
      const walletInitialized = await checkWalletCreated();
      setIsWalletInitialized(walletInitialized);
      setIsLoading(false);
    };

    // 调用这个异步函数
    initWallet();

    // 如果需要清理逻辑，可以在这里返回一个清理函数
    return () => {
      // 可选：任何需要在组件卸载时执行的清理代码
    };
  }, []);

  const handleWalletCreated = (mnemonic: string) => {
    // 这里可以使用助记词初始化您的钱包
    console.log("钱包已创建，助记词长度:", mnemonic.split(" ").length);

    // 设置状态表示钱包已初始化
    setIsWalletInitialized(true);
  };

  // if (isLoading) {
  //   return (
  //     <Box
  //       display="flex"
  //       justifyContent="center"
  //       alignItems="center"
  //       height="full"
  //       width="full"
  //       background="black"
  //       color="white"
  //     >
  //       <Text>加载中...</Text>
  //     </Box>
  //   );
  // }

  return (
    // `WagmiProvider` 包裹了整个应用，提供了 `wagmi` 的配置和上下文。
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Box
          display="flex"
          justifyContent="center"
          style={{ height: 600, width: 360, margin: "0 auto" }}
        >
          {isLoading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="full"
              width="full"
              background="black"
              color="white"
            >
              <Text>加载中...</Text>
            </Box>
          ) : (
            <>
              {isWalletInitialized ? (
                <Home />
              ) : (
                <CreateWallet onComplete={handleWalletCreated} />
              )}
            </>
          )}
        </Box>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
