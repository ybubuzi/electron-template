
import { APP_CONFIG } from '@common/Store'
type StoreInstance = {
    key: string,
    fileName?: string,
    data: Record<string, any>
}
const defaultConfigs: Array<StoreInstance> = [
    {
        key: APP_CONFIG,
        fileName: 'conf',
        data: {}
    }
]
export default defaultConfigs