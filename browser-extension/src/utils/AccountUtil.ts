import { Address } from 'viem'

// 作用是从环境变量 (.env) 里读取 EVM 和 Solana 的私钥，并存储在 AccountUtil 对象中
export const AccountUtil = {
  // 读取以太坊私钥
  // ？不懂为什么要把私钥断言成地址类型，难道读取的不是私钥而是地址
  // 这个对象在/core/transport.ts中36line被使用，就是通过私钥获取账户
  // 所以这里的as Address感觉意义不大
  privateKeyEvm: process.env.EIP155_PRIVATE_KEY as Address, 
  privateKeySolana: new Uint8Array(
    (process.env.SOLANA_PRIVATE_KEY as string).split(',') as unknown as number[]
  )
}
