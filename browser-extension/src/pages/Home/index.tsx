import { useMemo, useState } from 'react'

import { Keypair } from '@solana/web3.js'
import Big from 'big.js'
import { privateKeyToAccount } from 'viem/accounts'

import { Box } from '../../components/Box'
import { IconButton, IconButtonKey } from '../../components/IconButton'
import { Text } from '../../components/Text'
import { Token } from '../../components/Token'
import { Zorb } from '../../components/Zorb'
import { useBalance } from '../../hooks/useBalance'
import { AccountUtil } from '../../utils/AccountUtil'
import { HelperUtil } from '../../utils/HelperUtil'

// EVM
const { address } = privateKeyToAccount(AccountUtil.privateKeyEvm)

// Solana
const keypair = Keypair.fromSecretKey(AccountUtil.privateKeySolana)
const publicKey = keypair.publicKey

export function Home() {
  const [copied, setCopied] = useState(false)
  const [page, setPage] = useState<'ethereum' | 'solana'>('ethereum')

  const isEVM = page === 'ethereum'  //isEVM 是一个布尔值 (true 或 false)   // 仅当 page 为 'ethereum' 时，isEVM 才是 true

  const account = isEVM ? address : publicKey.toString()

  // ?? 是 JavaScript 的 空值合并运算符。
	// 当 page 为 null 或 undefined 时，返回 'ethereum' 作为默认值。
  const balance = useBalance(page ?? 'ethereum', account)
  // eslint-disable-next-line new-cap
  const formattedBalance = Big(balance).round(4).toString()  //Big.js 是一个高精度的数学库，适用于 处理大数 和 避免浮点数误差

  // 仅在 isEVM 或 copied 变化时 重新计算 iconOptions，避免不必要的重渲染
  const iconOptions = useMemo(
    () => ({
      // 如果 copied === true，则键名为 "checkmark"，否则 "copy"
      [copied ? 'checkmark' : 'copy']: {
        label: 'Copy',
        onClick: () => {
          setCopied(true) //// 设为已复制状态
          navigator.clipboard.writeText(account) // 复制地址到剪贴板
          setTimeout(() => setCopied(false), 1500)  // 1.5秒后取消 "已复制" 状态
        }
      },
      switch: {
        label: 'Switch',
        onClick: () => {
          // 如果 isEVM === true（当前是 Ethereum）
          // 如果 isEVM === false（当前是 Solana）
          setPage(isEVM ? 'solana' : 'ethereum')  //在 Ethereum 和 Solana 之间切换。
                                                  //setPage() 可能是一个 useState 钩子，用于 切换 UI。
        
        }
      },
      /**打开区块链浏览器（Etherscan 或 Solana Explorer）。
	    	_blank：在新标签页打开 account 的页面。 */
      arrowRightUp: {
        label: 'View',
        onClick: () => {
          window.open(
            isEVM
              ? `https://etherscan.io/address/${account}`
              : `https://explorer.solana.com/address/${account}`,
            '_blank'
          )
        }
      }
    }),
    [isEVM, copied]
  )

  return (
    <Box
      height="full"
      width="full"
      display="flex"
      alignItems="center"
      flexDirection="column"
      background="black"
      color="white"
      paddingTop="12"
      paddingX="5"
    >
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
            {HelperUtil.shortenAddress(account)}
          </Text>
          <Box display="flex" alignItems="center" gap="4">
            {Object.entries(iconOptions).map(([icon, { label, onClick }]) => (
              <IconButton key={icon} label={label} onClick={onClick} icon={icon as IconButtonKey} />
            ))}
          </Box>
        </Box>

        <Token token={isEVM ? 'ethereum' : 'solana'} balance={formattedBalance} />
      </Box>
    </Box>
  )
}
