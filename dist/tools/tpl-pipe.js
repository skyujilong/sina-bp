"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = require("stream");
const mustache_1 = require("mustache");
/**
 * pipe转换流
 * Transform类 是一个抽象类，应该实现_transform方法， 该方法能够获取上一次pipe的内容。
 * Transform类 本身是一个可读可写流
 */
class ContentChange extends stream_1.Transform {
    constructor(opts) {
        super(opts);
        this.data = opts.data;
    }
    _transform(chunk, encoding, callback) {
        //转化为文本内容
        let content = chunk.toString();
        callback(null, mustache_1.render(content, this.data));
    }
}
exports.default = ContentChange;
