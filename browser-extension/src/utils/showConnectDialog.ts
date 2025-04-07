export async function showConnectDialog(): Promise<boolean> {
  return new Promise((resolve) => {
    // 你可以用原生 JS 弹窗，也可以用自定义 React/Vue UI，以下是简单例子
    const confirmed = window.confirm("是否授权连接钱包？");
    resolve(confirmed);
  });
}
