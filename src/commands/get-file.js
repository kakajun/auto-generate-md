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
exports.getNote = exports.getFileNodes = exports.getImport = exports.getFile = void 0;
/* 获取文件相关方法 */
var fs_1 = require("fs");
var path_1 = require("path");
var promises_1 = require("fs/promises");
var debug_1 = require("debug");
var change_path_1 = require("./change-path");
var router_utils_1 = require("../utils/router-utils");
var debug = (0, debug_1.default)('get-file');
debug.enabled = false;
var rootPath = process.cwd().replace(/\\/g, '/');
var node_environment_1 = require("node-environment");
var isDev = (0, node_environment_1.env)() === 'development';
/**
 * @description:Gets the header comment of the file  获取文件的头部注释
 * @param {*} fullPath
 * @return {*}
 */
function getFile(fullPath) {
    return __awaiter(this, void 0, void 0, function () {
        var str, size, sarr, rowSize, imports, f;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, promises_1.readFile)(fullPath, 'utf-8')];
                case 1:
                    str = _a.sent();
                    size = str.length;
                    sarr = str.split(/[\n]/g);
                    rowSize = sarr.length;
                    return [4 /*yield*/, getImport(sarr, fullPath)];
                case 2:
                    imports = _a.sent();
                    f = sarr[0].indexOf('eslint') === -1 &&
                        (sarr[0].indexOf('-->') > -1 || sarr[0].indexOf('*/') > -1 || sarr[0].indexOf('//') > -1)
                        ? sarr[0]
                        : '';
                    return [2 /*return*/, {
                            note: f.replace(/<\/?[^>]*>|(\n|\r)/g, ''), // 去掉尾巴换行符号
                            size: size,
                            rowSize: rowSize,
                            imports: imports
                        }];
            }
        });
    });
}
exports.getFile = getFile;
/**
 * @desc: 这是初始化时就获取每个文件依赖的方法, 但要求先补全后缀,否则不灵
 * @param {any} sarr
 * @param {string} fullPath
 */
function getImport(sarr, fullPath) {
    return __awaiter(this, void 0, void 0, function () {
        var packageJsonPath, dependencies, imports;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    packageJsonPath = path_1.default.join(rootPath, 'package.json');
                    return [4 /*yield*/, (0, router_utils_1.getDependencies)(packageJsonPath)
                        // 这里获取每个文件的import路径
                    ];
                case 1:
                    dependencies = _a.sent();
                    imports = [];
                    sarr.forEach(function (ele) {
                        if (ele.indexOf('from') > -1) {
                            var obj = (0, change_path_1.changeImport)(ele, fullPath, dependencies);
                            if (obj) {
                                var absoluteImport = obj.absoluteImport;
                                if (absoluteImport) {
                                    imports.push(absoluteImport);
                                }
                            }
                        }
                    });
                    return [2 /*return*/, imports];
            }
        });
    });
}
exports.getImport = getImport;
/**
 * @description:Generate node information for all files 生成所有文件的node信息
 * @param {*} dir   要解析的路径
 * @param {Array} nodes
 * @param {Number} level
 * @return {*}
 */
function getFileNodes(dir, option, nodes, level) {
    if (dir === void 0) { dir = process.cwd(); }
    if (nodes === void 0) { nodes = []; }
    if (level === void 0) { level = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var ignore, include, files, _loop_1, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ignore = [
                        // 'api',
                        // 'src',
                        'bin',
                        'lib',
                        'jest.config.js',
                        'router',
                        'img',
                        'styles',
                        'node_modules',
                        'LICENSE',
                        '.git',
                        '.github',
                        'dist',
                        '.husky',
                        '.vscode',
                        '.eslintrc.js',
                        'readme-file.js',
                        'readme-md.js'
                    ];
                    include = isDev ? ['.js', '.vue'] : ['.js', '.vue', '.ts', '.tsx'];
                    if (option) {
                        ignore = option.ignore || ignore;
                        include = option.include || include;
                    }
                    files = fs_1.default
                        .readdirSync(dir)
                        .map(function (item) {
                        var fullPath = path_1.default.join(dir, item);
                        var isDir = fs_1.default.lstatSync(fullPath).isDirectory();
                        return {
                            name: item,
                            isDir: isDir,
                            level: level,
                            note: '',
                            imports: new Array(),
                            belongTo: new Array()
                        };
                    })
                        //Sort folders and files, otherwise the generated will not correspond to the opening order of the editor 对文件夹和文件进行排序,要不然生成的和编辑器打开的顺序不对应
                        .sort(function (a, b) {
                        if (!a.isDir && b.isDir)
                            return 1;
                        if (a.isDir && !b.isDir)
                            return -1;
                        if ((a.isDir && b.isDir) || (!a.isDir && !b.isDir))
                            return 0;
                        return 0;
                    });
                    _loop_1 = function (index) {
                        var item, foldFlag, fullPath, isDir, i, lastName, obj;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    item = files[index];
                                    foldFlag = ignore.findIndex(function (obj) { return obj === item.name; });
                                    if (!(foldFlag === -1)) return [3 /*break*/, 4];
                                    fullPath = path_1.default.join(dir, item.name);
                                    isDir = fs_1.default.lstatSync(fullPath).isDirectory();
                                    if (!isDir) return [3 /*break*/, 2];
                                    //recursion 递归
                                    return [4 /*yield*/, getFileNodes(fullPath, option, (item.children = []), level + 1)];
                                case 1:
                                    //recursion 递归
                                    _b.sent();
                                    item.fullPath = fullPath.replace(/\\/g, '/');
                                    nodes.push(item);
                                    return [3 /*break*/, 4];
                                case 2:
                                    i = fullPath.lastIndexOf('.');
                                    lastName = fullPath.substring(i);
                                    if (!include.includes(lastName)) return [3 /*break*/, 4];
                                    return [4 /*yield*/, getFile(fullPath)];
                                case 3:
                                    obj = _b.sent();
                                    Object.assign(item, obj);
                                    item.suffix = lastName;
                                    item.fullPath = fullPath.replace(/\\/g, '/');
                                    nodes.push(item);
                                    _b.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < files.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(index)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    index += 1;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, nodes];
            }
        });
    });
}
exports.getFileNodes = getFileNodes;
/**
 * @description:Recursive file name + note  递归得到文件名+note
 * @param {Array} datas
 * @param {string} keys
 * @return {*}
 */
function getNote(datas, keys) {
    var nodes = keys || [];
    datas.forEach(function (obj, index) {
        var last = index === datas.length - 1;
        if (obj.children) {
            //fold
            getNote(obj.children, nodes);
        }
        var md = setMd(obj, last);
        nodes.push(md);
    });
    return nodes;
}
exports.getNote = getNote;
/**
 * @description:One obj generates one line of text  一个obj生成一个一行文字
 * @param {ItemType} obj
 * @param {Boolean} last  Is it the last one  是不是最后一个
 * @return {*}
 */
function setMd(obj, last) {
    var filesString = '';
    var blank = '│ '.repeat(obj.level); // 重复空白
    var pre = "".concat(blank).concat(last ? '└──' : '├──', " ").concat(obj.name);
    if (obj.isDir) {
        filesString += "".concat(pre, "\n");
    }
    else {
        filesString += "".concat(pre, "            ").concat(obj.note, "\n");
    }
    return filesString;
}
