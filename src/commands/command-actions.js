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
exports.generateAllAction = exports.renameFileAction = exports.renameFoldAction = exports.deletMarkAction = exports.witeFileAction = exports.markFileAction = exports.changesuffixAction = exports.changeAbsolutePathAction = exports.changePathAction = exports.getMdAction = void 0;
var wirte_md_1 = require("./wirte-md");
var rename_path_1 = require("./rename-path");
var consola_1 = require("consola");
var change_path_1 = require("./change-path");
var mark_file_1 = require("./mark-file");
var get_router_1 = require("./get-router");
var path_1 = require("path");
var fs_1 = require("fs");
var logger = (0, consola_1.createConsola)({
    level: 4
});
// 为什么要加process.cwd()的replace 是为了抹平window和linux生成的路径不一样的问题
var rootPath = process.cwd().replace(/\\/g, '/');
/**
 * @desc: //2.  得到md文档,------------>会写(只生成一个md)
 * @param {string} md
 */
function getMdAction(md) {
    console.log('\x1B[36m%s\x1B[0m', '*** location: ', "".concat(rootPath, "/readme-md.md"));
    (0, wirte_md_1.wirteMd)(md, "".concat(rootPath, "/readme-md.md"));
}
exports.getMdAction = getMdAction;
/**
 * @desc: 这里做一个前置判断, 如果父路径不是src, 报错, 因为有changepath@符号是指向src的
 */
function checkFold() {
    var foldPath = path_1.default.resolve('./').replace(/\\/g, '/');
    var foldArrs = foldPath.split('/');
    var foldName = foldArrs.pop();
    if (foldName === 'pages') {
        return;
    }
    if (foldName !== 'src') {
        logger.error('changePath需要在src目录下运行命令! ');
        process.exit(1);
    }
}
/**
 * @desc:   //3. 更改所有为绝对路径+ 后缀补全------------>会写(会操作代码)
 * @param {Array} nodes
 */
function changePathAction(nodes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFold();
                    return [4 /*yield*/, (0, change_path_1.changePath)(nodes)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.changePathAction = changePathAction;
/**
 * @desc: 修改绝对路径
 */
function changeAbsolutePathAction() {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); });
}
exports.changeAbsolutePathAction = changeAbsolutePathAction;
function changesuffixAction(nodes, nochangePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFold();
                    return [4 /*yield*/, (0, change_path_1.changePath)(nodes, nochangePath)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.changesuffixAction = changesuffixAction;
/**
 * @desc:   //4. 打标记 ------------> 会写(会操作代码)   //5. 分文件 ------------> 会写(会另外生成包文件)

 * @param {Array} nodes
 */
function markFileAction(nodes) {
    return __awaiter(this, void 0, void 0, function () {
        var routers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFold();
                    return [4 /*yield*/, (0, get_router_1.getRouterArrs)()];
                case 1:
                    routers = _a.sent();
                    fs_1.default.writeFileSync(rootPath + '/router-file.js', 'const router=' + JSON.stringify(routers), { encoding: 'utf8' });
                    if (!routers) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, mark_file_1.markFile)(nodes, routers)];
                case 2:
                    _a.sent();
                    (0, change_path_1.wirteJsNodes)(JSON.stringify(nodes), rootPath + '/readme-file.js');
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.markFileAction = markFileAction;
/**
 * @desc: 5,将打标记的进行copy
 * @param {Array} nodes
 */
function witeFileAction(nodes) {
    return __awaiter(this, void 0, void 0, function () {
        var routers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, get_router_1.getRouterArrs)()];
                case 1:
                    routers = _a.sent();
                    if (!routers) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, mark_file_1.markFile)(nodes, routers)
                        // copy文件一定是建立在打标记的基础上
                    ];
                case 2:
                    _a.sent();
                    // copy文件一定是建立在打标记的基础上
                    return [4 /*yield*/, (0, mark_file_1.witeMarkFile)(nodes, routers)];
                case 3:
                    // copy文件一定是建立在打标记的基础上
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.witeFileAction = witeFileAction;
// /**
//  * @desc://6. 得到md对象(只生成一个md)
//  * @param {Array} nodes
//  */
// async function wirteJsNodesAction(nodes: ItemType[]) {
//   // 要先改路径后缀,否则依赖收集不到
//   await changePathAction(nodes)
//   wirteJsNodes(JSON.stringify(nodes), rootPath + '/readme-file.js')
// }
/**
 * @desc://7. 删除标记

 * @param {Array} nodes
 */
function deletMarkAction(nodes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, mark_file_1.deletMarkAll)(nodes, 'mark');
            return [2 /*return*/];
        });
    });
}
exports.deletMarkAction = deletMarkAction;
/**
 * @desc://8. 规范命名文件夹kabel-case
 * @param {Array} nodes
 */
function renameFoldAction(nodes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, rename_path_1.renameFoldPath)(nodes);
            return [2 /*return*/];
        });
    });
}
exports.renameFoldAction = renameFoldAction;
/**
 * @desc://9. 规范命名文件kabel-case

 * @param {Array} nodes
 */
function renameFileAction(nodes) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            (0, rename_path_1.renameFilePath)(nodes);
            return [2 /*return*/];
        });
    });
}
exports.renameFileAction = renameFileAction;
/**
 * @desc: 执行所有操作
 * @param {Array} nodes
 * @param {string} md
 */
function generateAllAction(nodes, md) {
    return __awaiter(this, void 0, void 0, function () {
        var routers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkFold();
                    return [4 /*yield*/, (0, get_router_1.getRouterArrs)()];
                case 1:
                    routers = _a.sent();
                    if (!routers) return [3 /*break*/, 5];
                    getMdAction(md);
                    return [4 /*yield*/, changePathAction(nodes)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, markFileAction(nodes)
                        // copy文件一定是建立在打标记的基础上
                    ];
                case 3:
                    _a.sent();
                    // copy文件一定是建立在打标记的基础上
                    return [4 /*yield*/, (0, mark_file_1.witeMarkFile)(nodes, routers)];
                case 4:
                    // copy文件一定是建立在打标记的基础上
                    _a.sent();
                    (0, change_path_1.wirteJsNodes)(JSON.stringify(nodes), rootPath + '/readme-file.js');
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.generateAllAction = generateAllAction;
