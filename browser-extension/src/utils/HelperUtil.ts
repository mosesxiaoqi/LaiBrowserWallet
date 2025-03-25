export const HelperUtil = {
  shortenAddress(address: string) {
    return `${address?.slice(0, 6)}…${address?.slice(-4)}`
  }
}
// 代码的作用是对以太坊地址（或其他长字符串）进行缩短，方便 UI 显示
// address?.slice(0, 6) → 截取前 6 个字符
// address?.slice(-4) → 截取最后 4 个字符
// … → 在中间添加 …（省略号）
// 返回格式：前6位…后4位

// HelperUtil 是一个对象，里面存放了 shortenAddress 方法。
// 你可以通过 HelperUtil.shortenAddress("0x1234...") 直接调用它。
// 它不会存储数据，而是封装工具函数，方便复用。