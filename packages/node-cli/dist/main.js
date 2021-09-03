#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (_) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var crypto_js_1 = __importDefault(require("crypto-js"));
var constance_1 = require("./constance");
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var url_1 = __importDefault(require("url"));
var form_data_1 = __importDefault(require("form-data"));
var utils_1 = require("./utils");
var chalk_1 = __importDefault(require("chalk"));
var filePathLength = process.argv.length - 2;
var PostRequestData = function (path, headers, data, form) {
    return new Promise(function (resolve, reject) {
        var whatWg = new url_1.default.URL(path);
        var req = https_1.default
            .request({
            path: path,
            method: "post",
            headers: headers,
            hostname: whatWg.hostname,
            port: whatWg.port,
        }, function (res) {
            var data = "";
            res.on("data", function (chunk) {
                data += chunk;
            });
            res.on("end", function () {
                var parseData = JSON.parse(data);
                if (parseData.ok === 0) {
                    resolve(parseData);
                }
                else {
                    resolve(parseData);
                }
            });
        })
            .on("error", function (err) {
            reject(err);
        });
        if (headers["Content-Type"].match("application/x-www-form-urlencoded")) {
            var queryString = new url_1.default.URLSearchParams();
            for (var key in data) {
                queryString.append(key, String(data[key]));
            }
            req.write(queryString.toString());
            req.end();
        }
        else if (headers["Content-Type"].match("multipart/form-data")) {
            for (var key in data) {
                form.append(key, data[key]);
            }
            form.getLength(function (err, length) {
                req.setHeader("Content-length", length);
                form.pipe(req);
            });
        }
    });
};
var createSign = function (ts) {
    var md5 = crypto_js_1.default.MD5(constance_1.APP_ID + ts).toString();
    var sha1 = crypto_js_1.default.HmacSHA1(md5, constance_1.SECRET_KEY);
    var sign = crypto_js_1.default.enc.Base64.stringify(sha1);
    return sign;
};
var SliceIdGenerator = /** @class */ (function () {
    function SliceIdGenerator(__ch) {
        if (__ch === void 0) { __ch = ""; }
        this.__ch = __ch;
        this.__ch = "aaaaaaaaa`";
    }
    SliceIdGenerator.prototype.getNextSliceId = function () {
        var ch = this.__ch;
        var i = ch.length - 1;
        while (i >= 0) {
            var ci = ch[i];
            if (ci !== "z") {
                ch = ch.slice(0, i) + String.fromCharCode(ci.charCodeAt(0) + 1) + ch.slice(i + 1);
                break;
            }
            else {
                ch = ch.slice(0, i) + "a" + ch.slice(i + 1);
                i--;
            }
        }
        this.__ch = ch;
        return this.__ch;
    };
    return SliceIdGenerator;
}());
var sliceIdInstance = new SliceIdGenerator();
function bootStrap(i) {
    return __awaiter(this, void 0, void 0, function () {
        var audioFilePath, CURRENT_TIME, signa, fileLen, filename, sliceNum, prepareFn, uploadFn, mergeFn, getProgressFn, getResultFn, prepareRes, result_1, _1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (filePathLength <= 0) {
                        (0, utils_1.log)("\n\u5DF2\u5168\u90E8\u6210\u529F\u8F6C\u5199 " + chalk_1.default.greenBright(process.argv.length - 2) + " \u4E2A\u6587\u4EF6");
                        process.exit(1);
                    }
                    (0, utils_1.log)(chalk_1.default.yellow("\u6B63\u5728\u8FDB\u884C\u8BED\u97F3\u8F6C\u5199 " + chalk_1.default.greenBright(process.argv.length - i - 1) + " / " + chalk_1.default.greenBright(process.argv.length - 2) + "\n"));
                    audioFilePath = path_1.default.resolve(process.cwd(), process.argv[process.argv.length - i]);
                    if (!fs_1.default.existsSync(audioFilePath)) {
                        (0, utils_1.err)("\n\nThe audio file is no exit!\n\n");
                        process.exit(1);
                    }
                    else {
                        (0, utils_1.log)("\u606D\u559C\uFF01\u6587\u4EF6\u5730\u5740\u5408\u6CD5 \u5F53\u524D\u6587\u4EF6\u8DEF\u5F84 " + chalk_1.default.greenBright(audioFilePath));
                    }
                    CURRENT_TIME = Math.floor(Date.now() / 1000);
                    signa = createSign(CURRENT_TIME);
                    fileLen = fs_1.default.statSync(audioFilePath).size;
                    filename = path_1.default.basename(audioFilePath);
                    sliceNum = Math.ceil(fileLen / constance_1.FILE_PIECE_SICE);
                    (0, utils_1.log)("\u6587\u4EF6\u957F\u5EA6 " + chalk_1.default.greenBright(fileLen) + " \u6587\u4EF6\u540D " + chalk_1.default.greenBright(filename) + " \u5206 " + chalk_1.default.greenBright(sliceNum) + " \u6B21\u4E0A\u4F20");
                    (0, utils_1.log)("\u5F00\u59CB\u8C03\u7528\u524D\u7F6E\u63A5\u53E3 prepare ");
                    prepareFn = function () {
                        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/prepare", {
                                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                        }, {
                                            app_id: constance_1.APP_ID,
                                            signa: signa,
                                            ts: CURRENT_TIME,
                                            file_len: fileLen,
                                            file_name: filename,
                                            slice_num: sliceNum,
                                        })];
                                    case 1:
                                        result = _a.sent();
                                        if (result.ok === 0) {
                                            resolve(result);
                                        }
                                        else {
                                            reject(JSON.stringify(__assign(__assign({}, result), { stack: "prepare" })));
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    uploadFn = function (data) {
                        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var start, index, upload, result;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        (0, utils_1.log)("\u8C03\u7528\u524D\u7F6E\u63A5\u53E3\u6210\u529F prepare \u5F00\u59CB\u8C03\u7528\u4E0A\u4F20\u63A5\u53E3 upload");
                                        start = 0, index = 0;
                                        upload = function (fileLen) { return __awaiter(_this, void 0, void 0, function () {
                                            var len, end, form, fileFragment, uploadRes;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        (0, utils_1.log)("\u6B63\u5728\u4E0A\u4F20 " + chalk_1.default.greenBright(++index + " / " + sliceNum));
                                                        len = fileLen < constance_1.FILE_PIECE_SICE ? fileLen : constance_1.FILE_PIECE_SICE, end = start + len - 1;
                                                        form = new form_data_1.default();
                                                        fileFragment = fs_1.default.createReadStream(audioFilePath, {
                                                            start: start,
                                                            end: end,
                                                        });
                                                        return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/upload", {
                                                                "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
                                                            }, {
                                                                app_id: constance_1.APP_ID,
                                                                signa: signa,
                                                                ts: CURRENT_TIME,
                                                                task_id: data,
                                                                slice_id: sliceIdInstance.getNextSliceId(),
                                                                content: fileFragment,
                                                            }, form)];
                                                    case 1:
                                                        uploadRes = _a.sent();
                                                        if (!(uploadRes.ok === 0)) return [3 /*break*/, 4];
                                                        start = end + 1;
                                                        fileLen -= len;
                                                        if (!(fileLen > 0)) return [3 /*break*/, 3];
                                                        return [4 /*yield*/, upload(fileLen)];
                                                    case 2: return [2 /*return*/, _a.sent()];
                                                    case 3: return [2 /*return*/, uploadRes];
                                                    case 4: return [2 /*return*/];
                                                }
                                            });
                                        }); };
                                        return [4 /*yield*/, upload(fileLen)];
                                    case 1:
                                        result = _a.sent();
                                        if (result.ok === 0) {
                                            resolve(result);
                                        }
                                        else {
                                            reject(JSON.stringify(__assign(__assign({}, result), { stack: "upload" })));
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    mergeFn = function (data) {
                        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        (0, utils_1.log)("\u6587\u4EF6\u4E0A\u4F20\u6210\u529F \u8C03\u7528\u5408\u5E76\u63A5\u53E3 merge");
                                        return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/merge", {
                                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                            }, {
                                                app_id: constance_1.APP_ID,
                                                signa: signa,
                                                ts: CURRENT_TIME,
                                                task_id: data,
                                            })];
                                    case 1:
                                        result = _a.sent();
                                        if (result.ok === 0) {
                                            resolve(result);
                                        }
                                        else {
                                            reject(JSON.stringify(__assign(__assign({}, result), { stack: "merge" })));
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    getProgressFn = function (data) {
                        return new Promise(function (resolve, reject) {
                            (0, utils_1.log)("\u5408\u5E76\u6210\u529F \u6BCF " + chalk_1.default.greenBright(5) + " \u79D2 \u8C03\u7528\u8FDB\u5EA6\u67E5\u8BE2\u63A5\u53E3 getProgress");
                            var timer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0: return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/getProgress", {
                                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                            }, {
                                                app_id: constance_1.APP_ID,
                                                signa: signa,
                                                ts: CURRENT_TIME,
                                                task_id: data,
                                            })];
                                        case 1:
                                            result = _b.sent();
                                            if (result.ok === 0) {
                                                (0, utils_1.log)("正在获取转码进度", JSON.stringify(result));
                                                if (((_a = JSON.parse(result.data)) === null || _a === void 0 ? void 0 : _a.status) === 9) {
                                                    clearInterval(timer);
                                                    resolve(result);
                                                }
                                            }
                                            else {
                                                clearInterval(timer);
                                                (0, utils_1.err)("调用失败了", JSON.stringify(result));
                                                reject(JSON.stringify(__assign(__assign({}, result), { stack: "progress" })));
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); }, 5000);
                        });
                    };
                    getResultFn = function (data) {
                        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/getResult", {
                                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                        }, {
                                            app_id: constance_1.APP_ID,
                                            signa: createSign(CURRENT_TIME),
                                            ts: CURRENT_TIME,
                                            task_id: data,
                                        })];
                                    case 1:
                                        result = _a.sent();
                                        if (result.ok === 0) {
                                            resolve(result);
                                        }
                                        else {
                                            reject(JSON.stringify(__assign(__assign({}, result), { stack: "result" })));
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, prepareFn()];
                case 2:
                    prepareRes = _a.sent();
                    return [4 /*yield*/, uploadFn(prepareRes.data)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, mergeFn(prepareRes.data)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, getProgressFn(prepareRes.data)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, getResultFn(prepareRes.data)];
                case 6:
                    result_1 = _a.sent();
                    fs_1.default.mkdir("xf-audio-source", function () {
                        var file = fs_1.default.createWriteStream(process.cwd() + "/xf-audio-source/" + filename.slice(0, -4) + ".txt");
                        file.write(constance_1.BANNER + result_1.data);
                        file.end();
                        file.on("finish", function () {
                            (0, utils_1.log)("\u6E90\u6587\u4EF6\u6210\u529F\u4FDD\u5B58\u5728 " + chalk_1.default.greenBright(process.cwd() + "/xf-audio-source/" + filename.slice(0, -4) + ".txt"));
                            bootStrap(--filePathLength);
                        });
                    });
                    return [3 /*break*/, 8];
                case 7:
                    _1 = _a.sent();
                    (0, utils_1.err)(_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
(function (filePathLength) {
    if (filePathLength <= 0) {
        (0, utils_1.err)("请提供文件地址");
        process.exit(1);
    }
    bootStrap(filePathLength);
})(filePathLength);
