import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { useQuery } from '@tanstack/react-query'
import Big from 'big.js'
import { Address, formatEther } from 'viem'
import { useBalance as useWagmiBalance } from 'wagmi'


export function useBalance(chain: 'ethereum' | 'solana', account: string) {

  // query: { enabled } 是 react-query 提供的选项。
	// enabled 是一个布尔值，决定是否启用查询
  // 如果 chain === 'ethereum'，enabled = true，启动查询
  const { data: ethereumBalance } = useWagmiBalance({
    address: account as Address,
    query: {
      enabled: chain === 'ethereum'   //这段代码竟然是先判断在调用，从语言上完全看不出来 
                                      //enabled 是 react-query 内部的控制机制，能够在查询执行前先判断是否要查询，从而完全跳过 API 请求
    }
  })

  const { data: solanaBalance = 0 } = useQuery({
    queryKey: ['balance', account],
    queryFn: async () => {
      const connection = new Connection(clusterApiUrl('mainnet-beta'))
      const wallet = new PublicKey(account)
      const balance = await connection.getBalance(wallet)

      // eslint-disable-next-line new-cap
      return Big(balance).div(LAMPORTS_PER_SOL).toNumber()
    },
    enabled: chain === 'solana'
  })

  return chain === 'ethereum'
    ? formatEther(ethereumBalance?.value ?? BigInt(0))
    : solanaBalance.toString()
}
