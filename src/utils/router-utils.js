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
exports.getDependencies = exports.parseComponentPath = exports.parseRouterPath = void 0;
var promises_1 = require("fs/promises");
/**
 * 解析路由文件中的路由路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string} - 解析出的路由路径。
 */
function parseRouterPath(line) {
    var pathRegex = /path:\s*['"]([^'"]+)['"]/;
    // const pathRegex = /path: [\'|\"](.*)[\'|\"]/
    var match = line.match(pathRegex);
    return match ? match[1] : '';
}
exports.parseRouterPath = parseRouterPath;
/**
 * 解析路由文件中的组件路径。
 * @param {string} line - 路由文件中的一行。
 * @return {string | ''} - 解析出的组件路径或null。
 */
function parseComponentPath(line) {
    var componentRegex = /component:\s*\(\)\s*=>\s*import\(['"]([^'"]+)['"]\)/;
    var match = line.match(componentRegex);
    return match ? match[1] : '';
}
exports.parseComponentPath = parseComponentPath;
function getDependencies(packageJsonPath) {
    return __awaiter(this, void 0, void 0, function () {
        var dependencies, pkg, _a, _b, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    dependencies = [];
                    if (!packageJsonPath) return [3 /*break*/, 5];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, promises_1.access)(packageJsonPath)];
                case 2:
                    _c.sent();
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, (0, promises_1.readFile)(packageJsonPath, 'utf-8')];
                case 3:
                    pkg = _b.apply(_a, [_c.sent()]);
                    dependencies = Object.keys(pkg.dependencies || {}).concat(Object.keys(pkg.devDependencies || {}));
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, dependencies];
            }
        });
    });
}
exports.getDependencies = getDependencies;
