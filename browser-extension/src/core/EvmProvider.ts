import EventEmitter from 'eventemitter3'
import { EIP1193Parameters } from 'viem'

import { createReownTransport } from './transport'

const transport = createReownTransport() //创建一个 transport 传输对象，可能是 HTTP、WebSocket 或其他通信方式


// 这个类是一个符合 EIP-1193 规范的以太坊 Provider，用于处理 DApp 发送的 JSON-RPC 请求，并通过 transport 进行通信
export class EvmProvider extends EventEmitter {
  request({ method, params }: EIP1193Parameters) {
    // 处理 JSON-RPC 请求，并通过 transport.send() 发送请求
    return transport.send({
      method,
      params
    })
  }
}
