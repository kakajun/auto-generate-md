"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var help_1 = require("../help");
var package_json_1 = require("../../package.json");
function handle(settings) {
    if (settings.help) {
        (0, help_1.default)();
    }
    if (settings.version) {
        console.log("agmd version is: " + '\x1B[36m%s\x1B[0m', package_json_1.default.version);
        process.exit(0);
    }
    if (settings.ignore) {
        settings.ignores = settings.ignore.split(' ');
    }
    if (settings.include) {
        settings.includes = settings.include.split(' ');
    }
    return settings;
}
exports.default = handle;
