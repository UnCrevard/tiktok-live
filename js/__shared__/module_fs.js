"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReadStream = exports.createWriteStream = exports.del = exports.timeout = exports.getCurrentDirectory = exports.setCurrentDirectory = exports.createDirectory = exports.rename = exports.appendFile = exports.writeFile = exports.readFile = exports.exists = void 0;
const fs = __importStar(require("fs"));
function exists(filename) {
    return new Promise(resolve => fs.exists(filename, resolve));
}
exports.exists = exists;
exports.readFile = (filename) => new Promise((resolve, reject) => fs.readFile(filename, (err, data) => err ? reject(err) : resolve(data)));
function writeFile(filename, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, err => err ? reject(err) : resolve(err));
    });
}
exports.writeFile = writeFile;
function appendFile(filename, data) {
    return new Promise((resolve, reject) => {
        fs.appendFile(filename, data, err => err ? reject(err) : resolve(err));
    });
}
exports.appendFile = appendFile;
function rename(src, dst) {
    return new Promise((resolve, reject) => {
        fs.rename(src, dst, err => err ? reject(err) : resolve(err));
    });
}
exports.rename = rename;
function createDirectory(path) {
    return exists(path)
        .then(bool => {
        if (!bool) {
            return new Promise((resolve, reject) => {
                fs.mkdir(path, err => err ? reject(err) : resolve(true));
            });
        }
        else {
            return true;
        }
    });
}
exports.createDirectory = createDirectory;
async function setCurrentDirectory(path) {
    process.chdir(path);
    return true;
}
exports.setCurrentDirectory = setCurrentDirectory;
async function getCurrentDirectory() {
    return process.cwd();
}
exports.getCurrentDirectory = getCurrentDirectory;
function timeout(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
exports.timeout = timeout;
function del(filename) {
    return new Promise((resolve, reject) => fs.unlink(filename, err => err ? reject(err) : resolve(true)));
}
exports.del = del;
exports.createWriteStream = fs.createWriteStream;
exports.createReadStream = fs.createReadStream;
