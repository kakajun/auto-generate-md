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
exports.getRouterArrs = exports.getRouter = exports.getAllRouter = exports.getRouterFilePath = void 0;
var promises_1 = require("fs/promises");
var debug_1 = require("debug");
var consola_1 = require("consola");
var path_1 = require("path");
var router_utils_1 = require("../utils/router-utils");
var logger = (0, consola_1.createConsola)({
    level: 4
});
var debug = (0, debug_1.default)('get-file');
debug.enabled = false;
var rootPath = process.cwd().replace(/\\/g, '/');
/**
 * @desc: 递归获取路由数组
 */
function getRouterFilePath(dir) {
    return __awaiter(this, void 0, void 0, function () {
        function finder(p) {
            return __awaiter(this, void 0, void 0, function () {
                var files, _i, files_1, val, fPath, stats;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, (0, promises_1.readdir)(p)];
                        case 1:
                            files = _a.sent();
                            _i = 0, files_1 = files;
                            _a.label = 2;
                        case 2:
                            if (!(_i < files_1.length)) return [3 /*break*/, 7];
                            val = files_1[_i];
                            fPath = path_1.default.join(p, val).replace(/\\/g, '/');
                            return [4 /*yield*/, (0, promises_1.stat)(fPath)];
                        case 3:
                            stats = _a.sent();
                            if (!stats.isDirectory()) return [3 /*break*/, 5];
                            return [4 /*yield*/, finder(fPath)];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            if (stats.isFile()) {
                                routes.push(fPath);
                            }
                            _a.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 2];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        }
        var routes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    routes = [];
                    return [4 /*yield*/, finder(dir)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, routes];
            }
        });
    });
}
exports.getRouterFilePath = getRouterFilePath;
/**
 * @desc: 获取所有路由

 */
function getAllRouter(dir) {
    return __awaiter(this, void 0, void 0, function () {
        var filePaths, routers, _i, filePaths_1, filePath, routerItems;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRouterFilePath(dir)];
                case 1:
                    filePaths = _a.sent();
                    routers = [];
                    _i = 0, filePaths_1 = filePaths;
                    _a.label = 2;
                case 2:
                    if (!(_i < filePaths_1.length)) return [3 /*break*/, 5];
                    filePath = filePaths_1[_i];
                    return [4 /*yield*/, getRouter(filePath)];
                case 3:
                    routerItems = _a.sent();
                    routers.push.apply(routers, routerItems);
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/, routers];
            }
        });
    });
}
exports.getAllRouter = getAllRouter;
/**
 * @desc: 得到路由

 */
function getRouter(routerPath) {
    return __awaiter(this, void 0, void 0, function () {
        var routers, fileContent, lines, currentPath_1, currentComponent_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    routers = [];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    // 检查文件是否存在
                    return [4 /*yield*/, (0, promises_1.access)(routerPath)];
                case 2:
                    // 检查文件是否存在
                    _a.sent();
                    return [4 /*yield*/, (0, promises_1.readFile)(routerPath, 'utf-8')];
                case 3:
                    fileContent = _a.sent();
                    lines = fileContent.split(/\n/g);
                    currentPath_1 = '';
                    currentComponent_1 = '';
                    lines.forEach(function (line) {
                        if (line.includes('//'))
                            return; // 跳过注释行
                        var tempPath = (0, router_utils_1.parseRouterPath)(line);
                        if (tempPath)
                            currentPath_1 = tempPath;
                        var tempComponent = (0, router_utils_1.parseComponentPath)(line);
                        if (tempComponent)
                            currentComponent_1 = tempComponent;
                        if (currentPath_1 && currentComponent_1) {
                            routers.push({ path: currentPath_1, component: currentComponent_1 });
                            currentPath_1 = '';
                            currentComponent_1 = '';
                        }
                    });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error('读取路由配置时出错:', error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, routers];
            }
        });
    });
}
exports.getRouter = getRouter;
/**
 * @desc: 获取要操作的路由
 */
function getRouterArrs() {
    return __awaiter(this, void 0, void 0, function () {
        var pathName, dir, routers, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pathName = "".concat(rootPath, "/classify.js");
                    dir = "".concat(rootPath, "/router");
                    routers = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, (0, promises_1.stat)(pathName)];
                case 2:
                    if (!_b.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, Promise.resolve("".concat(pathName)).then(function (s) { return require(s); })];
                case 3:
                    routers = _b.sent();
                    return [3 /*break*/, 6];
                case 4:
                    _a = {
                        name: 'mark'
                    };
                    return [4 /*yield*/, getAllRouter(dir)];
                case 5:
                    // 如果没有classify.js，则直接找路由
                    routers = [
                        (_a.router = _b.sent(),
                            _a)
                    ];
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_2 = _b.sent();
                    logger.error('根路径没有发现 classify.js，并且 src 里面没有 router 文件，现在退出');
                    process.exit(1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/, routers];
            }
        });
    });
}
exports.getRouterArrs = getRouterArrs;
