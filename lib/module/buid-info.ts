import BpConf from "./bp-conf";
/**
 * 构建对象
 */
class BuildInfo {
    name: string //项目名称
    git: string | null | undefined //git地址。 ssh的
    isCompanyProject: boolean // 是否是公司项目
    isActivity: boolean // 是否是公司的活动项目
    bpConf: BpConf // 配置文件 实例对象
    /**
     * 
     * @param name 项目名字
     * @param git git项目地址 可以为空
     * @param bpConf 配置信息
     */
    constructor(name: string, git: string | null | undefined, isCompanyProject: boolean, isActivity: boolean, bpConf: BpConf) {
        this.name = name;
        this.git = git;
        this.isActivity = isActivity;
        this.bpConf = bpConf;
        this.isCompanyProject = isCompanyProject;
    }
    setIsCompanyProject(isCompanyProject: boolean): void {
        this.isCompanyProject = isCompanyProject;
    }
}

export default BuildInfo;