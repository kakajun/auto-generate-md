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
exports.wirteJsNodes = exports.witeFile = exports.changeImport = exports.getImportName = exports.makeSuffix = exports.getRelatPath = exports.changePath = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var promises_1 = require("fs/promises");
var consola_1 = require("consola");
var router_utils_1 = require("../utils/router-utils");
var logger = (0, consola_1.createConsola)({
    level: 4
});
var rootPath = process.cwd().replace(/\\/g, '/');
/**
 * @desc: 递归循环所有文件

 * @param {Array} nodes      整个文件的nodes
 */
function changePath(nodes, nochangePath) {
    return __awaiter(this, void 0, void 0, function () {
        function getNode(objs) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, objs_1, ele;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _i = 0, objs_1 = objs;
                            _a.label = 1;
                        case 1:
                            if (!(_i < objs_1.length)) return [3 /*break*/, 6];
                            ele = objs_1[_i];
                            if (!ele.children) return [3 /*break*/, 3];
                            return [4 /*yield*/, getNode(ele.children)];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, witeFile(ele, true, nochangePath)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/];
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
exports.changePath = changePath;
/**
 * @desc: 这里返回没有@ 符号的路径
 * @param {string} absoluteImport  依赖本身名字
 * @param {string} fullPath  文件本身绝对地址
 */
function getRelatPath(absoluteImport, fullPath) {
    var relatPath = path_1.default.relative(path_1.default.dirname(fullPath), absoluteImport).replace(/\\/g, '/');
    if (!relatPath.startsWith('.')) {
        relatPath = './' + relatPath;
    }
    return relatPath;
}
exports.getRelatPath = getRelatPath;
/**
 * @desc: 补后缀的方法+替换前缀
 * @param {string} filePath  正则匹配到的依赖路径
 * @param {string} fullPath  本身文件名路径
 * @param {string} impName   正确的名字
 */
function makeSuffix(filePath, fullPath) {
    var absoluteImport = filePath.includes('@')
        ? filePath.replace('@', process.cwd())
        : path_1.default.resolve(path_1.default.dirname(fullPath), filePath);
    var lastName = path_1.default.extname(absoluteImport);
    if (!lastName) {
        var suffixes = ['.js', '.ts', '.vue', '.tsx', '/index.js', '/index.vue'];
        for (var _i = 0, suffixes_1 = suffixes; _i < suffixes_1.length; _i++) {
            var suffix = suffixes_1[_i];
            if (fs_1.default.existsSync(absoluteImport + suffix)) {
                absoluteImport += suffix;
                logger.info('补充后缀:', absoluteImport + suffix);
                break;
            }
        }
    }
    return absoluteImport.replace(/\\/g, '/');
}
exports.makeSuffix = makeSuffix;
/**
 * @desc: 根据一行代码匹配import的详细内容  TODO 这里还得优化

 */
function getImportName(ele, dependencies) {
    var str = '';
    var flag = dependencies.some(function (item) { return ele.indexOf(item) > -1; });
    var reg = / from [\"|\'](.*)[\'|\"]/;
    // 这里只收集组件依赖, 插件依赖排除掉
    if (!flag && ele.indexOf('/') > -1 && ele.indexOf('//') !== 0) {
        var impStr = ele.match(reg);
        // 没有import的不转
        if (impStr && impStr[1])
            str = impStr[1];
    }
    return str;
}
exports.getImportName = getImportName;
/**
 * @desc: 找到import并返回全路径和原始路径
 * @param {string} ele    找到的行引入
 * @param {string} fullPath  文件的全路径
 */
function changeImport(ele, fullPath, dependencies, nochangePath) {
    var impName = getImportName(ele, dependencies);
    if (!impName)
        return null;
    var absoluteImport = makeSuffix(impName, fullPath);
    var obj = {
        impName: nochangePath ? impName : getRelatPath(absoluteImport, fullPath),
        filePath: impName,
        absoluteImport: absoluteImport
    };
    return obj;
}
exports.changeImport = changeImport;
/**
 * @desc:  写文件
 * @param {string} file  目标地址
 */
function witeFile(node, isRelative, nochangePath) {
    return __awaiter(this, void 0, void 0, function () {
        var fullPath, packageJsonPath, dependencies, writeFlag, fileStr, sarr, index, ele, obj, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fullPath = node.fullPath;
                    packageJsonPath = path_1.default.join(rootPath, 'package.json');
                    return [4 /*yield*/, (0, router_utils_1.getDependencies)(packageJsonPath)];
                case 1:
                    dependencies = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    writeFlag = false // 如果啥都没改, 不更新文件
                    ;
                    return [4 /*yield*/, (0, promises_1.readFile)(fullPath, 'utf-8')];
                case 3:
                    fileStr = _a.sent();
                    sarr = fileStr.split(/[\n]/g);
                    for (index = 0; index < sarr.length; index++) {
                        ele = sarr[index];
                        if (ele.indexOf('from') > -1 && isRelative) {
                            obj = changeImport(ele, fullPath, dependencies, nochangePath);
                            if (obj && obj.impName) {
                                sarr[index] = ele.replace(obj.filePath, obj.impName);
                                logger.info('node: ', node);
                                writeFlag = true;
                            }
                        }
                    }
                    if (writeFlag) {
                        fileStr = sarr.join('\n');
                        // 异步写入数据到文件
                        fs_1.default.writeFileSync(fullPath, fileStr, { encoding: 'utf8' });
                        logger.success("Write file successful: ".concat(fullPath));
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    logger.error("\u8BFB\u53D6\u6587\u4EF6\u5931\u8D25,\u6587\u4EF6\u540D: ".concat(fullPath, " "));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.witeFile = witeFile;
/**
 * @description: Write the result to JS file 把结果写入到js文件
 * @param {data}  要写的数据
 * @return {fileName}  要写入文件地址
 */
function wirteJsNodes(data, filePath) {
    var file = path_1.default.resolve(rootPath, filePath);
    var content = "export default ".concat(data);
    fs_1.default.writeFileSync(file, content, { encoding: 'utf8' });
    logger.success("Write file successful: ".concat(filePath));
}
exports.wirteJsNodes = wirteJsNodes;
