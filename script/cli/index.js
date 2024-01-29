"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arg_1 = require("arg");
var stringToArgs = function (rawArgs) {
    var args = (0, arg_1.default)({
        '--ignore': String,
        '--include': String,
        '--version': Boolean,
        '--help': Boolean,
        '-h': '--help',
        '-i': '--ignore',
        '-in': '--include',
        '-v': '--version'
    }, {
        argv: rawArgs.slice(2)
    });
    return {
        help: args['--help'],
        ignore: args['--ignore'],
        include: args['--include'],
        version: args['--version']
    };
};
exports.default = stringToArgs;
