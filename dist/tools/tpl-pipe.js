"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var mustache_1 = require("mustache");
/**
 * pipe转换流
 * Transform类 是一个抽象类，应该实现_transform方法， 该方法能够获取上一次pipe的内容。
 * Transform类 本身是一个可读可写流
 */
var ContentChange = /** @class */ (function (_super) {
    __extends(ContentChange, _super);
    function ContentChange(opts) {
        var _this = _super.call(this, opts) || this;
        _this.data = opts.data;
        return _this;
    }
    ContentChange.prototype._transform = function (chunk, encoding, callback) {
        //转化为文本内容
        var content = chunk.toString();
        callback(null, mustache_1.render(content, this.data));
    };
    return ContentChange;
}(stream_1.Transform));
exports.default = ContentChange;
