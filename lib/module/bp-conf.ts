/**
 * 配置对象
 */
class BpConf {
    workspace: string
    devHost: string
    prodPath: string
    prodImgPath: string
    tinyPngKeys: string[]
    constructor(workspace: string, devHost: string, prodPath: string, prodImgPath: string, tinyPngKeys: string[]) {
        this.workspace = workspace;
        this.devHost = devHost;
        this.prodPath = prodPath;
        this.prodImgPath = prodImgPath;
        this.tinyPngKeys = tinyPngKeys;
    }
    
}


export default BpConf;