"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var st = "\u4F7F\u7528\u8BF4\u660E:\n1. \u5728\u63A7\u5236\u53F0\u6309\u4E0A\u4E0B\u5207\u6362\u529F\u80FD\u5E76\u56DE\u8F66\u8FDB\u884C\u786E\u8BA4, \u6267\u884C\u76F8\u5BF9\u5E94\u7684\u64CD\u4F5C\uFF01\n2. \u53EF\u4EE5\u5728package.json\u4E2D\u7684scripts\u4E0B\u9762\u914D\u7F6E\u5982\u4E0B\uFF0C\u7136\u540E\u8FD0\u884C\u547D\u4EE4:\nagmd  --include str  --ignore str\n  \u9009\u9879:\n  --include string  / -i string..........  \u5305\u62EC\u6587\u4EF6\u6269\u5C55\u540D\n  --ignore string  / -in string........... \u5FFD\u7565\u6587\u4EF6\u6216\u8005\u6587\u4EF6\u5939\n\n  \u5404\u9009\u9879\u7684\u9ED8\u8BA4\u914D\u7F6E:\n  --ignore  img,styles,node_modules,LICENSE,.git,.github,dist,.husky,.vscode,readme-file.js,readme-md.js\n  --include  .js,.vue,.ts\n\n  \u8BF4\u660E:\n  \u914D\u7F6E\u4E2D\u7684\u5B57\u7B26\u4E32\u4E4B\u95F4\u4E0D\u5E94\u6709\u7A7A\u683C\n\n  \u4E3E\u4F8B:\n\n  $ agmd  --ignore lib,node_modules,dist --include .js,.ts,.vue";
function help() {
    console.log(st);
    process.exit(0);
}
exports.default = help;
