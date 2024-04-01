import type { VNode, ComponentInternalInstance } from 'vue'

export interface MessageProps {
  id: string
  message?: string | VNode
  duration?: number
  showClose?: boolean
  type?: 'success' | 'info' | 'warning' | 'danger'
  onDestory: () => void
  offset?: number
  zIndex: number
  transitionName?:string
}

export interface MessageContext {
  id: string
  vnode: VNode
  props: MessageProps
  vm: ComponentInternalInstance
}

export type CreateMessageProps = Omit<MessageProps, 'onDestory' | 'id' | 'zIndex'>
