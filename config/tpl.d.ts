//定义module中引入的tpl 输出string类型！
declare module '*.tpl' {
    const content: string;
    export default content;
}