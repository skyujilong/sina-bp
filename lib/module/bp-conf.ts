/**
 * 配置对象
 */
class BpConf {
    workspace: string
    devHost: string
    prodHost: string
    prodImgHost: string
    tinyPngKeys: string[]
    qbDir?:string
    constructor(workspace: string, devHost: string, prodHost: string, prodImgHost: string, tinyPngKeys: string[], qbDir?: string) {
        this.workspace = workspace;
        this.devHost = devHost;
        this.prodHost = prodHost;
        this.prodImgHost = prodImgHost || prodHost;
        this.tinyPngKeys = tinyPngKeys;
        if (qbDir){
            this.qbDir = qbDir;
        }
    }
    
}


export default BpConf;