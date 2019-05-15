"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 构建对象
 */
class BuildInfo {
    /**
     *
     * @param name 项目名字
     * @param git git项目地址 可以为空
     * @param bpConf 配置信息
     */
    constructor(name, git, isCompanyProject, isActivity, bpConf) {
        this.name = name;
        this.git = git;
        this.isActivity = isActivity;
        this.bpConf = bpConf;
        this.isCompanyProject = isCompanyProject;
    }
    setIsCompanyProject(isCompanyProject) {
        this.isCompanyProject = isCompanyProject;
    }
}
exports.default = BuildInfo;
