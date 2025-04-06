import { Box } from "../../Box";
import { Text } from "../../Text";

// 首先定义类型接口
interface Network {
  id: number;
  name: string;
  type: string;
  icon: React.ReactNode;
}

interface NetworkOptionProps {
  network: Network;
  isActive: boolean;
  onClick: () => void;
}

// 网络选项组件
export function NetworkOption({
  network,
  isActive,
  onClick,
}: NetworkOptionProps) {
  return (
    <Box
      as="button"
      display="flex"
      alignItems="center"
      gap="2"
      padding="2"
      borderRadius="8"
      width="full"
      style={{
        background: isActive ? "#1F1F1F" : "transparent", // 使用具体颜色值替代 "neutrals800"
        transition: "transform 0.2s",
        cursor: "pointer",
      }}
      onClick={onClick}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {network.icon}
      <Text fontSize="14" color={"white"}>
        {network.name}
      </Text>
    </Box>
  );
}
