import {
    Transform
} from 'stream';

import {
    render
} from 'mustache';

/**
 * pipe转换流
 * Transform类 是一个抽象类，应该实现_transform方法， 该方法能够获取上一次pipe的内容。
 * Transform类 本身是一个可读可写流
 */
class ContentChange extends Transform {
    data:any
    constructor(opts) {
        super(opts);
        this.data = opts.data;
    }
    _transform(chunk: any, encoding: string, callback: Function): void {
        //转化为文本内容
        let content:string = chunk.toString();
        callback(null, render(content,this.data));
    }
}

export default ContentChange;