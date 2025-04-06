import { Box } from "../../Box";
import { useState } from "react";
import { Text } from "../../Text";
import { NetworkOption } from "../NetworkOption";
import { EthereumIcon } from "../EtherumIcon";
import { ChevronDown } from "../ChevronDown";
import { SepoliaIcon } from "../SepoliaIcon";

// 修改接口名称，避免与组件同名
interface NetworkSelectorProps {
  currentNetwork: number;
  onNetworkChange: (networkId: number) => void; // 添加正确的回调函数类型
}

export function NetworkSelector({
  currentNetwork,
  onNetworkChange,
}: NetworkSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 网络配置
  const networks = [
    {
      id: 1,
      name: "Ethereum",
      type: "mainnet",
      icon: <EthereumIcon />,
    },
    {
      id: 11_155_111,
      name: "Sepolia",
      type: "testnet",
      icon: <SepoliaIcon />,
    },
  ];

  // 获取当前网络信息
  const currentNetworkInfo =
    networks.find((net) => net.id === currentNetwork) || networks[0];

  return (
    <div style={{ position: "absolute", top: "3px", left: "3px", zIndex: 10 }}>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        gap="2"
        padding="2"
        borderRadius="10"
        background="neutrals900"
        onClick={() => setIsOpen(!isOpen)}
        // className={touchableStyles({
        //   active: "shrink",
        //   hover: "grow",
        // })}
      >
        {currentNetworkInfo.icon}
        <Text fontSize="14" fontWeight="medium" color="white">
          {currentNetworkInfo.name}
        </Text>
        <ChevronDown />
      </Box>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: "0px",
            marginTop: "4px",
          }}
        >
          <Box
            background="neutrals900"
            borderRadius="10"
            width="180"
            style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)" }}
            padding="2"
          >
            <Text
              fontSize="12"
              fontWeight="bold"
              padding="2"
              color="neutrals400"
            >
              主网
            </Text>
            {networks
              .filter((net) => net.type === "mainnet")
              .map((network) => (
                <NetworkOption
                  key={network.id}
                  network={network}
                  isActive={currentNetwork === network.id}
                  onClick={() => {
                    onNetworkChange(network.id);
                    setIsOpen(false);
                  }}
                />
              ))}

            <Box height="1" background="neutrals800" marginY="2" />

            <Text
              fontSize="12"
              fontWeight="bold"
              padding="2"
              color="neutrals400"
            >
              测试网
            </Text>
            {networks
              .filter((net) => net.type === "testnet")
              .map((network) => (
                <NetworkOption
                  key={network.id}
                  network={network}
                  isActive={currentNetwork === network.id}
                  onClick={() => {
                    onNetworkChange(network.id);
                    setIsOpen(false);
                  }}
                />
              ))}
          </Box>
        </div>
      )}
    </div>
  );
}
