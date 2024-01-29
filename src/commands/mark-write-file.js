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
exports.setDispFileNew = exports.markWriteFile = void 0;
var debug_1 = require("debug");
var mark_file_1 = require("./mark-file");
var fs_extra_1 = require("fs-extra");
var consola_1 = require("consola");
var logger = (0, consola_1.createConsola)({
    level: 4
});
var rootPath = process.cwd().replace(/\\/g, '/');
var debug = (0, debug_1.default)('mark-write-file');
debug.enabled = false;
/**
 * 递归文件子依赖创建文件。文件外递归。
 * @param nodes - 节点列表
 * @param name - 文件名
 * @param path - 绝对路径
 */
function markWriteFile(nodes, name, path) {
    return __awaiter(this, void 0, void 0, function () {
        var node, _i, _a, element;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    debug('入参: ', name, path);
                    node = (0, mark_file_1.findNodes)(nodes, path);
                    debug('查找的node: ', node);
                    if (!node || node.copyed)
                        return [2 /*return*/];
                    node.copyed = true;
                    if (!(node.belongTo.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, setDispFileNew(path, name)];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    if (!node.imports) return [3 /*break*/, 8];
                    _i = 0, _a = node.imports;
                    _b.label = 3;
                case 3:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    element = _a[_i];
                    return [4 /*yield*/, fs_extra_1.default.pathExists(element)];
                case 4:
                    if (!_b.sent()) return [3 /*break*/, 6];
                    return [4 /*yield*/, markWriteFile(nodes, name, element)];
                case 5:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 6:
                    logger.error("".concat(element, " \u6587\u4EF6\u4E0D\u5B58\u5728"));
                    _b.label = 7;
                case 7:
                    _i++;
                    return [3 /*break*/, 3];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.markWriteFile = markWriteFile;
/**
 * 复制文件到指定位置。
 * @param pathN - 源文件路径
 * @param name - 目标文件夹名
 */
function setDispFileNew(pathN, name) {
    return __awaiter(this, void 0, void 0, function () {
        var relative, writeFileName, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    relative = pathN.replace(rootPath, '');
                    writeFileName = "".concat(rootPath, "/").concat(name).concat(relative);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fs_extra_1.default.pathExists(writeFileName)];
                case 2:
                    if (_a.sent())
                        return [2 /*return*/];
                    return [4 /*yield*/, fs_extra_1.default.copy(pathN, writeFileName)];
                case 3:
                    _a.sent();
                    debug('写入文件success! : ', writeFileName);
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    logger.error('文件写入失败');
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.setDispFileNew = setDispFileNew;
