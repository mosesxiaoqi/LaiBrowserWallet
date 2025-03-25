import { registerWallet } from '@wallet-standard/core'
import { announceProvider } from 'mipd'   //announceProvider → EIP-6963 规范的方法，用于广播 EVM 兼容的钱包，使 DApp 发现 window.ethereum
import { v4 as uuidv4 } from 'uuid'  //uuidv4() → 生成一个唯一的 UUID，用于标识该钱包实例。

import { EvmProvider } from './core/EvmProvider'
import { SolanaProvider } from './core/SolanaProvider'
import { ConstantsUtil } from './utils/ConstantsUtil'

const evmProvider = new EvmProvider()
const solanaProvider = new SolanaProvider()

announceProvider({
  info: {
    icon: ConstantsUtil.IconRaw,
    name: 'Reown',
    rdns: 'reown.com',
    uuid: uuidv4()
  },
  // We can fix type errors by providing all RPC methods to ReownEvmProvider (EIP1193 provider)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  provider: evmProvider
})

registerWallet(solanaProvider)
