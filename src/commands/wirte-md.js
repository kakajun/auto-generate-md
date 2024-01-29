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
exports.getMd = exports.wirteMd = void 0;
/* 生成md说明文档 */
var fs_1 = require("fs");
var path_1 = require("path");
var get_file_1 = require("./get-file");
var consola_1 = require("consola");
var debug_1 = require("debug");
var logger = (0, consola_1.createConsola)({
    level: 4
});
var rootPath = process.cwd().replace(/\\/g, '/');
var debug = (0, debug_1.default)('wirte-md');
debug.enabled = false;
/**
 * @description :Write the result to JS file
 * @param {data} data
 */
function wirteMd(data, filePath) {
    var file = path_1.default.resolve(rootPath, filePath);
    // 异步写入数据到文件
    fs_1.default.writeFile(file, data, { encoding: 'utf8' }, function () {
        logger.success('Write successful');
    });
}
exports.wirteMd = wirteMd;
/**
 * @description: Get statistics
 * @param {Array} datas
 * @return {Object}
 */
function getCountMd(datas) {
    var rowTotleNumber = 0;
    var sizeTotleNumber = 0;
    var coutObj = {};
    function getDeatle(nodes) {
        nodes.forEach(function (obj) {
            if (obj.children)
                getDeatle(obj.children);
            else if (obj.suffix && obj.rowSize && obj.size) {
                if (!coutObj.hasOwnProperty(obj.suffix))
                    coutObj[obj.suffix] = 0;
                coutObj[obj.suffix]++;
                rowTotleNumber += obj.rowSize;
                sizeTotleNumber += obj.size;
            }
        });
    }
    getDeatle(datas);
    return {
        rowTotleNumber: rowTotleNumber,
        sizeTotleNumber: sizeTotleNumber,
        coutObj: coutObj
    };
}
/**
 * @description:Thousands format 千分位格式化
 * @param {num} num format a number 要格式化数字
 * @return {string}
 */
function format(num) {
    var reg = /\d{1,3}(?=(\d{3})+$)/g;
    return (num + '').replace(reg, '$&,');
}
/**
 * @description: Generate statistics MD 生成统计md
 * @param {object} obj
 * @return {string}
 */
function setCountMd(obj) {
    var rowTotleNumber = obj.rowTotleNumber, sizeTotleNumber = obj.sizeTotleNumber, coutObj = obj.coutObj;
    var countMd = '😍  代码总数统计：\n';
    var totle = 0;
    for (var key in coutObj) {
        var ele = coutObj[key];
        totle += ele;
        countMd += "\u540E\u7F00\u662F ".concat(key, " \u7684\u6587\u4EF6\u6709 ").concat(ele, " \u4E2A\n");
    }
    countMd += "\u603B\u5171\u6709 ".concat(totle, " \u4E2A\u6587\u4EF6\n");
    var md = "\u603B\u4EE3\u7801\u884C\u6570\u6709: ".concat(format(rowTotleNumber), "\u884C,\n\u603B\u4EE3\u7801\u5B57\u6570\u6709: ").concat(format(sizeTotleNumber), "\u4E2A\n");
    md = countMd + md;
    return md;
}
/**
 * @description: Generate MD 生成md
 * @param {object} option
 */
function getMd(option) {
    return __awaiter(this, void 0, void 0, function () {
        var nodes, countMdObj, coutMd, note, md;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logger.success('👉  命令运行位置: ' + process.cwd() + '\n');
                    return [4 /*yield*/, (0, get_file_1.getFileNodes)(rootPath, option)];
                case 1:
                    nodes = _a.sent();
                    countMdObj = getCountMd(nodes);
                    coutMd = setCountMd(countMdObj);
                    logger.success(coutMd);
                    note = (0, get_file_1.getNote)(nodes) // 得到所有note的数组
                    ;
                    md = note.join('') + '\n' // 数组转字符串
                    ;
                    if (md.length > 0) {
                        logger.success('🀄️  生成MarkDown完毕 !');
                    }
                    return [2 /*return*/, { md: md + coutMd, nodes: nodes }];
            }
        });
    });
}
exports.getMd = getMd;
