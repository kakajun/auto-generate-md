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
exports.replaceName = exports.renameFile = exports.changePathName = exports.changePathFold = exports.renameFold = exports.renameFilePath = exports.renameFoldPath = exports.checkCamelFile = exports.toKebabCase = void 0;
/* 给路由文件打标记, 把标记打到最后,因为头部已经给了注释 */
var fs_extra_1 = require("fs-extra");
var debug_1 = require("debug");
var path_1 = require("path");
var consola_1 = require("consola");
var router_utils_1 = require("../utils/router-utils");
var change_path_1 = require("./change-path");
var logger = (0, consola_1.createConsola)({
    level: 4
});
var rootPath = process.cwd().replace(/\\/g, '/');
var debug = (0, debug_1.default)('rename-path');
debug.enabled = false;
/**
 * 将单个字符串的首字母小写
 * @param str 字符串
 */
function fistLetterLower(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
function toKebabCase(str) {
    var regex = /[A-Z]/g;
    return fistLetterLower(str).replace(regex, function (word) {
        return '-' + word.toLowerCase();
    });
}
exports.toKebabCase = toKebabCase;
/**
 * 检测驼峰文件名
 * @param fileName 文件名
 */
function checkCamelFile(fileName) {
    return /([a-z])([A-Z])/.test(fileName) || /([A-Z])/.test(fileName);
}
exports.checkCamelFile = checkCamelFile;
/**
 * @desc: 循环node, 改文件夹, 并把import 里面不合格的命名改合格
 */
function renameFoldPath(nodes) {
    return __awaiter(this, void 0, void 0, function () {
        function getNode(cpNodes) {
            return __awaiter(this, void 0, void 0, function () {
                var index, ele;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            index = 0;
                            _a.label = 1;
                        case 1:
                            if (!(index < cpNodes.length)) return [3 /*break*/, 5];
                            ele = cpNodes[index];
                            return [4 /*yield*/, renameFold(ele)]; // 下面已递归
                        case 2:
                            _a.sent(); // 下面已递归
                            if (!ele.children) return [3 /*break*/, 4];
                            // 递归
                            return [4 /*yield*/, getNode(ele.children)];
                        case 3:
                            // 递归
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            index++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNode(nodes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.renameFoldPath = renameFoldPath;
/**
 * @desc: 循环node, 改文件, 改依赖, 思路:循环每个文件, 并把import 里面不合格的命名改合格
 */
function renameFilePath(nodes) {
    return __awaiter(this, void 0, void 0, function () {
        function getNode(cpNodes) {
            return __awaiter(this, void 0, void 0, function () {
                var index, ele;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            index = 0;
                            _a.label = 1;
                        case 1:
                            if (!(index < cpNodes.length)) return [3 /*break*/, 7];
                            ele = cpNodes[index];
                            if (!ele.children) return [3 /*break*/, 3];
                            // 递归
                            return [4 /*yield*/, getNode(ele.children)];
                        case 2:
                            // 递归
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 3: 
                        // 重命名文件
                        return [4 /*yield*/, renameFile(ele)
                            // 重写文件的import
                        ];
                        case 4:
                            // 重命名文件
                            _a.sent();
                            // 重写文件的import
                            return [4 /*yield*/, rewriteFile(ele)];
                        case 5:
                            // 重写文件的import
                            _a.sent();
                            _a.label = 6;
                        case 6:
                            index++;
                            return [3 /*break*/, 1];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNode(nodes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.renameFilePath = renameFilePath;
function rewriteFile(node) {
    return __awaiter(this, void 0, void 0, function () {
        var writeFlag, str, sarr, packageJsonPath, dependencies, index, ele, impOldName, name_1, newName, s, fileStr, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    writeFlag = false;
                    str = fs_extra_1.default.readFileSync(node.fullPath, 'utf-8');
                    sarr = str.split(/[\n]/g);
                    packageJsonPath = path_1.default.join(rootPath, 'package.json');
                    return [4 /*yield*/, (0, router_utils_1.getDependencies)(packageJsonPath)
                        // 循环处理每一行
                    ];
                case 1:
                    dependencies = _a.sent();
                    // 循环处理每一行
                    for (index = 0; index < sarr.length; index++) {
                        ele = sarr[index];
                        if (ele.indexOf('from') > -1) {
                            impOldName = (0, change_path_1.getImportName)(ele, dependencies);
                            if (checkCamelFile(impOldName)) {
                                name_1 = path_1.default.parse(impOldName).name;
                                newName = toKebabCase(name_1);
                                s = ele.split('from');
                                sarr[index] = "".concat(s[0], "from").concat(s[1].replace(name_1, newName));
                                writeFlag = true;
                            }
                        }
                    }
                    if (!writeFlag) return [3 /*break*/, 5];
                    fileStr = sarr.join('\n');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    // 异步写入数据到文件
                    return [4 /*yield*/, fs_extra_1.default.writeFile(node.fullPath, fileStr, { encoding: 'utf8' })];
                case 3:
                    // 异步写入数据到文件
                    _a.sent();
                    logger.success("rewriteFile successful-------: ".concat(node.fullPath));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    logger.error("\u5199\u5165\u6587\u4EF6\u5931\u8D25,\u5730\u5740\u4E0D\u5B58\u5728: ".concat(node.fullPath));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/**
 * @desc: 重命名文件夹
 * @param {ItemType} node
 */
function renameFold(node) {
    return __awaiter(this, void 0, void 0, function () {
        var filename, filter, falg, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filename = path_1.default.parse(node.fullPath).base;
                    debug('filename111: ', filename);
                    filter = ['FMEA', 'DVP'] // 把这样子的文件夹过滤
                    ;
                    falg = filter.some(function (item) { return filename.indexOf(item) > -1; });
                    if (!(!falg && checkCamelFile(filename))) return [3 /*break*/, 2];
                    if (!node.isDir) return [3 /*break*/, 2];
                    return [4 /*yield*/, replaceName(node.fullPath)
                        // 这里一定要更新node,否则后面找不到路径
                    ];
                case 1:
                    obj = _a.sent();
                    // 这里一定要更新node,否则后面找不到路径
                    changePathFold(node, obj);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.renameFold = renameFold;
/**
 * @desc: 重命名后, 子文件都会存在路径的更改,也就要递归处理(既可以处理文件夹, 也可以处理文件)
 */
function changePathFold(node, obj) {
    var newName = obj.newName, filename = obj.filename;
    if (node.children) {
        for (var index = 0; index < node.children.length; index++) {
            var ele = node.children[index];
            // 递归处理
            changePathFold(ele, obj);
        }
    }
    node.fullPath = node.fullPath.replace(filename, newName);
    debug(node.fullPath, newName);
    node.name = node.name.replace(filename, newName);
}
exports.changePathFold = changePathFold;
/**
 * @desc: 递归改所有路径名字
 * @param {ItemType} node
 * @param {object} obj
 */
function changePathName(node, obj) {
    var newName = obj.newName, filename = obj.filename;
    if (node.fullPath.indexOf(filename) > -1) {
        if (node.imports.length > 0) {
            // import也要变化, 否则也会找不到路径
            var array = node.imports;
            for (var j = 0; j < array.length; j++) {
                var ele = array[j];
                debug('import-ele: ', ele);
                array[j] = toKebabCase(ele);
                debug('更换import: ', array[j]);
            }
        }
        node.fullPath = node.fullPath.replace(filename, newName);
        node.name = node.name.replace(filename, newName);
        debug('替换后的 node.fullPath:', node.fullPath);
    }
}
exports.changePathName = changePathName;
/**
 * @desc: 重命名文件
 * @param {ItemType} node
 */
function renameFile(node) {
    return __awaiter(this, void 0, void 0, function () {
        var filename, suffix, lastName_1, flag, obj;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filename = path_1.default.parse(node.fullPath).base;
                    if (!checkCamelFile(filename)) return [3 /*break*/, 2];
                    suffix = ['.js', '.vue', '.tsx'] // 这里只重命名js和vue文件
                    ;
                    lastName_1 = path_1.default.extname(node.fullPath);
                    flag = suffix.some(function (item) { return lastName_1 === item; });
                    if (!flag) return [3 /*break*/, 2];
                    return [4 /*yield*/, replaceName(node.fullPath)
                        // 这里一定要更新node,否则后面找不到路径
                    ];
                case 1:
                    obj = _a.sent();
                    // 这里一定要更新node,否则后面找不到路径
                    changePathName(node, obj);
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.renameFile = renameFile;
/**
 * 重命名文件夹 CamelCase || PascalCase => kebab-case
 * @param node 节点
 */
function replaceName(fullPath) {
    return __awaiter(this, void 0, void 0, function () {
        var filename, newName, oldPath, newPath, lastName, flag, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filename = path_1.default.parse(fullPath).base;
                    newName = toKebabCase(filename);
                    debug('newName: ', newName);
                    debug('filename: ', filename);
                    oldPath = fullPath;
                    newPath = oldPath.replace(filename, newName);
                    lastName = path_1.default.extname(newPath);
                    if (!!lastName) return [3 /*break*/, 2];
                    if (!fs_extra_1.default.existsSync(newPath)) return [3 /*break*/, 2];
                    // debug('newPath: ', newPath)
                    return [4 /*yield*/, fs_extra_1.default.copy(fullPath, newPath)];
                case 1:
                    // debug('newPath: ', newPath)
                    _a.sent();
                    fs_extra_1.default.removeSync(fullPath); // 删除目录
                    return [2 /*return*/, { newName: newName, filename: filename }];
                case 2:
                    debug(oldPath, newPath, 'oldPath, newPath');
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, , 8]);
                    flag = fs_extra_1.default.existsSync(oldPath);
                    if (!flag) return [3 /*break*/, 5];
                    console.log(oldPath, '改名为: ', newPath, '成功');
                    return [4 /*yield*/, fs_extra_1.default.rename(oldPath, newPath)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    logger.error("\u6587\u4EF6".concat(oldPath, "\u4E0D\u5B58\u5728\u91CD\u547D\u540D\u5E72\u561B?"));
                    _a.label = 6;
                case 6:
                    logger.info(filename + ' is reneme done');
                    return [2 /*return*/, { newName: newName, filename: filename }];
                case 7:
                    error_2 = _a.sent();
                    throw error_2;
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.replaceName = replaceName;
