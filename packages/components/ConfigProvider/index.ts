import ConfigProvider from "./ConfigProvider.vue";
import {withInstall} from '@eric-ui/utils'

export const ErConfigProvider = withInstall(ConfigProvider)

export * from './types'
export * from './hooks'