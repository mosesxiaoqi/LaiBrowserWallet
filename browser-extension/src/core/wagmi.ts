import { Transport } from 'viem'
import { mainnet } from 'viem/chains'
import { createConfig, http } from 'wagmi'

const supportedChains = [mainnet] as const

// [number] 代表数组中的每个元素的类型
export type ChainId = (typeof supportedChains)[number]['id']

const transports = supportedChains.reduce(

  /**
   * reduce() 运行过程
   *  chain = { id: 1, name: "Ethereum Mainnet" }
	•	  acc = {}（初始空对象）
	• 	acc[1] = http();    
      { 1: http() }

    chain = { id: 11155111, name: "Sepolia Testnet" }
	•	acc = { 1: http() }
	•	acc[11155111] = http();
    { 1: http(), 11155111: http() }
   */
  (acc, chain) => {
    acc[chain.id] = http()

    return acc
  },
  {} as Record<ChainId, Transport> //{} 是 reduce 的初始值，即 acc 开始时是个空对象 {}。 Record<ChainId, Transport> 指定 acc 的类型：
)

export const wagmiConfig = createConfig({
  chains: supportedChains,
  transports
})
