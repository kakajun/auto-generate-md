"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletMark = exports.deletMarkAll = exports.setmark = exports.findNodes = exports.setNodeMark = exports.witeMarkFile = exports.markFile = void 0;
/* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
var fs_1 = require("fs");
var mark_write_file_1 = require("./mark-write-file");
var debug_1 = require("debug");
var consola_1 = require("consola");
var logger = (0, consola_1.createConsola)({
    level: 4
});
var debug = (0, debug_1.default)('mark-file');
var rootPath = process.cwd().replace(/\\/g, '/');
debug.enabled = false;
/**
 * @desc: 标记文件主程序
 * @param {ItemType} nodes
 * @param {string} rootPath
 */
function markFile(nodes, routers) {
    return __awaiter(this, void 0, void 0, function () {
        var i, ele, j, obj, pathN, absolutePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < routers.length)) return [3 /*break*/, 6];
                    ele = routers[i];
                    j = 0;
                    _a.label = 2;
                case 2:
                    if (!(j < ele.router.length)) return [3 /*break*/, 5];
                    obj = ele.router[j];
                    pathN = obj.component;
                    logger.info("\u51C6\u5907\u5904\u7406".concat(obj.path));
                    absolutePath = pathN.replace('@', rootPath);
                    // 递归打上子集所有
                    return [4 /*yield*/, setNodeMark(nodes, ele.name, absolutePath)];
                case 3:
                    // 递归打上子集所有
                    _a.sent();
                    _a.label = 4;
                case 4:
                    j++;
                    return [3 /*break*/, 2];
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.markFile = markFile;
/**
 * @desc: 标记文件主程序
 * @param {ItemType} nodes
 * @param {string} rootPath
 */
function witeMarkFile(nodes, routers) {
    return __awaiter(this, void 0, void 0, function () {
        var index, ele, j, obj, pathN, absolutePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < routers.length)) return [3 /*break*/, 6];
                    ele = routers[index];
                    j = 0;
                    _a.label = 2;
                case 2:
                    if (!(j < ele.router.length)) return [3 /*break*/, 5];
                    obj = ele.router[j];
                    pathN = obj.component;
                    absolutePath = pathN.replace('@', rootPath);
                    // 对打上标记的文件进行分类写入
                    return [4 /*yield*/, (0, mark_write_file_1.markWriteFile)(nodes, ele.name, absolutePath)];
                case 3:
                    // 对打上标记的文件进行分类写入
                    _a.sent();
                    _a.label = 4;
                case 4:
                    j++;
                    return [3 /*break*/, 2];
                case 5:
                    index++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.witeMarkFile = witeMarkFile;
/**
 * @desc: 分离一个递归调用的mark函数
 */
function setNodeMark(nodes, name, path) {
    return __awaiter(this, void 0, void 0, function () {
        var node, index, element;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    debug('setNodeMark入参: ', name, path);
                    node = findNodes(nodes, path);
                    if (node) {
                        // 打标记
                        setmark(path, name);
                    }
                    if (!(node && node.imports)) return [3 /*break*/, 5];
                    // 标记归属设置
                    if (node.belongTo.indexOf(name) > -1)
                        return [2 /*return*/]; // 已经分析过该文件了, 就不再分析,否则会死循环
                    node.belongTo.push(name);
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < node.imports.length)) return [3 /*break*/, 5];
                    element = node.imports[index];
                    debug('依赖文件: ', element);
                    if (!fs_1.default.existsSync(path)) return [3 /*break*/, 3];
                    // 继续递归,直到子文件没有子文件
                    return [4 /*yield*/, setNodeMark(nodes, name, element)];
                case 2:
                    // 继续递归,直到子文件没有子文件
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    logger.error("\u6587\u4EF6\u4E0D\u5B58\u5728: ".concat(path));
                    _a.label = 4;
                case 4:
                    index++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.setNodeMark = setNodeMark;
/**
 * @desc: 递归通过文件全名找节点
 * @param {*} nodes
 * @param {*} path
 */
function findNodes(nodes, path) {
    var node = null;
    function find(objs) {
        for (var index = 0; index < objs.length; index++) {
            var element = objs[index];
            if (element.children)
                find(element.children);
            if (element.fullPath === path)
                node = element;
        }
    }
    find(nodes);
    return node;
}
exports.findNodes = findNodes;
/**
 * @desc: 给文件标记

 * @param {string} file
 * @param {string} name
 */
function setmark(file, name) {
    try {
        debug("mark preper ".concat(file));
        var fileStr = fs_1.default.readFileSync(file, 'utf-8');
        if (fileStr.indexOf('//' + name + '\n') === 0) {
            // 打过标记了,就不打了
            return;
        }
        // 直接打上标记
        fileStr = '//' + name + '\n' + fileStr;
        fs_1.default.writeFileSync(file, fileStr);
        logger.info("mark successful-------: ".concat(file));
    }
    catch (error) {
        logger.error("\u7ED9\u6587\u4EF6\u6253\u6807\u8BB0\u7684\u6587\u4EF6\u4E0D\u5B58\u5728: ".concat(file));
        return;
    }
}
exports.setmark = setmark;
/**
 * @desc: 递归所有文件,删除所有标记

 * @param {Array} nodes
 */
function deletMarkAll(nodes, name) {
    function find(objs) {
        for (var index = 0; index < objs.length; index++) {
            var element = objs[index];
            if (element.children)
                find(element.children);
            else
                deletMark(element.fullPath, name);
        }
    }
    find(nodes);
}
exports.deletMarkAll = deletMarkAll;
/**
 * @desc: 给文件标记

 * @param {string} file
 * @param {string} name
 */
function deletMark(file, name) {
    var fileStr = '';
    try {
        fileStr = fs_1.default.readFileSync(file, 'utf-8');
        var sarr = fileStr.split(/[\n]/g);
        for (var index = 0; index < sarr.length; index++) {
            var ele = sarr[index];
            if (ele.indexOf('//' + name) > -1) {
                sarr.splice(index, 1);
                index--; //i需要自减，否则每次删除都会讲原数组索引发生变化
            }
        }
        fileStr = sarr.join('\n');
        fs_1.default.writeFileSync(file, fileStr, { encoding: 'utf8' });
        debug('delete mark successful-------' + file);
        return fileStr;
    }
    catch (error) {
        console.error('删除标记的文件不存在: ', file);
    }
    return '';
}
exports.deletMark = deletMark;
