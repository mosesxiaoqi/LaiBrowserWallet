const INPAGE_ID = 'inpage'

export async function handleSetupInpage() {
  /***获取当前浏览器扩展已注册的 content script（即已经注入到页面的脚本）。
	•	返回值 是一个 content script 对象的数组，里面包含已注册的脚本信息。 */
  const registeredContentScripts = await chrome.scripting.getRegisteredContentScripts()
  // 查找 inpage.js 是否已注册   如果存在，inpageRegisteredContentScript 就是该脚本的对象，否则为 undefined。
  const inpageRegisteredContentScript = registeredContentScripts.find(({ id }) => id === INPAGE_ID)

  try {
    if (!inpageRegisteredContentScript) {
      // chrome.scripting.registerContentScripts() 用于动态注册 content script。
      chrome.scripting.registerContentScripts([
        {
          id: INPAGE_ID,
          matches: ['file://*/*', 'http://*/*', 'https://*/*'], // 匹配所有网址
          js: ['inpage.js'],  // 注入的脚本
          runAt: 'document_start',  // 在页面加载开始时执行
          world: 'MAIN'  // 运行在网页的主世界 (Main world)
        }
      ])
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('failed to register content scripts', e)
  }
}

handleSetupInpage()
