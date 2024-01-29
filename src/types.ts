// 定义 Router 接口
export interface Router {
  path: string
  component: string
}

export interface RouterItem {
  name: string
  router: Router[]
}

export interface OptionType {
  ignore?: string[]
  include?: string[]
}

export type ItemType = {
  name: string
  copyed?: boolean
  isDir: boolean
  level: number
  note: string
  size?: number
  suffix?: string
  rowSize?: number
  fullPath: string
  belongTo: string[] // 标记归属设置 分类用
  imports: string[] // 依赖收集
  children?: ItemType[]
}
