import { useState } from "react";
import { Box } from "../../components/Box";
import { Text } from "../../components/Text";
// import { Button } from "../../components/Button"; // 假设你有一个 Button 组件
import * as createLocalWallet from "../../core/create/create_local_wallet";

export function CreateWallet({
  onComplete,
}: {
  onComplete: (mnemonic: string) => void;
}) {
  const [walletInfo] = useState(() => createLocalWallet.createWallet("aabb"));
  const [confirmed, setConfirmed] = useState(false);

  // 将助记词拆分为单词数组
  const words = walletInfo.mnemonic.split(" ");

  const handleConfirm = () => {
    // 存储助记词（实际应用中应加密存储）
    // 更安全的存储方式可以使用 Web Crypto API 或IndexedDB
    // 这里为了功能演示，直接存储在 localStorage 中
    // 存储一个名为 laiWalletInitialized 的键，值为字符串 `"true",表示用户已经完成了钱包的初始化过程
    // localStorage.setItem("laiWalletInitialized", "true");
    createLocalWallet.setWalletInitialized();
    // 通知父组件完成初始化
    onComplete(walletInfo.mnemonic);
  };

  return (
    <Box
      height="full"
      width="full"
      display="flex"
      alignItems="center"
      flexDirection="column"
      background="black"
      color="white"
      padding="5"
      gap="4"
    >
      <Text
        as="h1"
        fontSize="20"
        fontWeight="bold"
        textAlign="center"
        color="neutrals400"
      >
        创建新钱包
      </Text>

      <Text fontSize="14" textAlign="center" color="neutrals400">
        请保存以下助记词，它是恢复钱包的唯一方式。请勿分享给他人。
      </Text>

      <Box
        display="flex"
        flexWrap="wrap"
        gap="2"
        padding="4"
        background="neutrals900"
        borderRadius="10"
        width="full"
        justifyContent="center"
      >
        {words.map((word, index) => (
          <Box
            key={index}
            padding="2"
            borderRadius="8"
            background="neutrals800"
          >
            <Text fontSize="14" color="white">
              {index + 1}. {word}
            </Text>
          </Box>
        ))}
      </Box>

      <Box display="flex" alignItems="center" gap="2" marginTop="4">
        <input
          type="checkbox"
          id="confirm"
          checked={confirmed}
          onChange={() => setConfirmed(!confirmed)}
        />
        <Text fontSize="14" as="label" htmlFor="confirm" color="neutrals400">
          我已安全保存助记词
        </Text>
      </Box>

      <Box marginTop="4" width="full">
        <Box
          as="button"
          width="full"
          padding="3"
          borderRadius="10"
          background={confirmed ? "accent050" : "neutrals800"}
          disabled={!confirmed}
          onClick={handleConfirm}
          style={{
            cursor: confirmed ? "pointer" : "not-allowed",
            opacity: confirmed ? 1 : 0.5,
          }}
        >
          <Text
            fontSize="16"
            fontWeight="medium"
            textAlign="center"
            color="neutrals400"
          >
            确认已保存
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
