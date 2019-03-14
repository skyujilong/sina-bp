/**
 * 配置对象
 */
class BpConf {
    workspace: string
    devHost: string
    prodHost: string
    prodImgHost: string
    tinyPngKeys: string[]
    constructor(workspace: string, devHost: string, prodHost: string, prodImgHost: string, tinyPngKeys: string[]) {
        this.workspace = workspace;
        this.devHost = devHost;
        this.prodHost = prodHost;
        this.prodImgHost = prodImgHost;
        this.tinyPngKeys = tinyPngKeys;
    }
    
}


export default BpConf;