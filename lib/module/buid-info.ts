import BpConf from "./bp-conf";
/**
 * 构建对象
 */
class BuildInfo {
    name: string
    git: string | null | undefined
    bpConf: BpConf
    /**
     * 
     * @param name 项目名字
     * @param git git项目地址 可以为空
     * @param bpConf 配置信息
     */
    constructor(name: string, git: string | null | undefined, bpConf: BpConf) {
        this.name = name;
        this.git = git;
        this.bpConf = bpConf;
    }
}

export default BuildInfo;