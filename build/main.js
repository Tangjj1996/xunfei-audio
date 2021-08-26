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
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var crypto_js_1 = require("crypto-js");
var constance_1 = require("./constance");
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
var form_data_1 = require("form-data");
var audioFilePath = process.argv[2];
if (!fs_1.default.existsSync(process.cwd() + audioFilePath)) {
    console.log("\n\nThe audio file is no exit!\n\n");
    process.exit(1);
}
var PostRequestData = function (path, headers, data, form) {
    return new Promise(function (resolve, reject) {
        var whatWg = new url_1.default.URL(path);
        var req = http_1.default
            .request({
            path: path,
            method: "post",
            headers: __assign(__assign({}, headers), { Host: whatWg.host }),
            hostname: "127.0.0.1",
            port: 8866,
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
            form.pipe(req);
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
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var filepath_1, fileLen, filename, prepareRes_1, start_1, upload_1, uploadRes, mergeRes, progressFn_1, timer_1, _1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                filepath_1 = process.cwd() + audioFilePath;
                fileLen = fs_1.default.statSync(filepath_1).size;
                filename = path_1.default.basename(filepath_1);
                return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/prepare", {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    }, {
                        app_id: constance_1.APP_ID,
                        signa: createSign(constance_1.CURRENT_TIME),
                        ts: constance_1.CURRENT_TIME,
                        file_len: fileLen,
                        file_name: filename,
                        slice_num: 1,
                    })];
            case 1:
                prepareRes_1 = _a.sent();
                if (!(prepareRes_1.ok === 0)) return [3 /*break*/, 4];
                start_1 = 0;
                upload_1 = function (fileLen) { return __awaiter(void 0, void 0, void 0, function () {
                    var len, end, form, fileFragment, uploadRes;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                len = fileLen < constance_1.FILE_PIECE_SICE ? fileLen : constance_1.FILE_PIECE_SICE, end = start_1 + len - 1;
                                form = new form_data_1.default();
                                fileFragment = fs_1.default.createReadStream(filepath_1, {
                                    start: start_1,
                                    end: end,
                                });
                                return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/upload", {
                                        "Content-Type": "multipart/form-data; boundary=" + form.getBoundary(),
                                    }, {
                                        app_id: constance_1.APP_ID,
                                        signa: createSign(constance_1.CURRENT_TIME),
                                        ts: constance_1.CURRENT_TIME,
                                        task_id: prepareRes_1.data,
                                        slice_id: sliceIdInstance.getNextSliceId(),
                                        content: fileFragment,
                                    }, form)];
                            case 1:
                                uploadRes = _a.sent();
                                if (!(uploadRes.ok === 0)) return [3 /*break*/, 4];
                                start_1 = end + 1;
                                fileLen -= len;
                                if (!(fileLen > 0)) return [3 /*break*/, 3];
                                return [4 /*yield*/, upload_1(fileLen)];
                            case 2: return [2 /*return*/, _a.sent()];
                            case 3: return [2 /*return*/, uploadRes];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                return [4 /*yield*/, upload_1(fileLen)];
            case 2:
                uploadRes = _a.sent();
                if (!(uploadRes.ok === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/merge", {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    }, {
                        app_id: constance_1.APP_ID,
                        signa: createSign(constance_1.CURRENT_TIME),
                        ts: constance_1.CURRENT_TIME,
                        task_id: prepareRes_1.data,
                    })];
            case 3:
                mergeRes = _a.sent();
                if (mergeRes.ok === 0) {
                    progressFn_1 = function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/getProgress", {
                                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                    }, {
                                        app_id: constance_1.APP_ID,
                                        signa: createSign(constance_1.CURRENT_TIME),
                                        ts: constance_1.CURRENT_TIME,
                                        task_id: prepareRes_1.data,
                                    })];
                                case 1: return [2 /*return*/, _a.sent()];
                            }
                        });
                    }); };
                    timer_1 = setInterval(function () { return __awaiter(void 0, void 0, void 0, function () {
                        var progressRes, getResultRes, file;
                        var _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, progressFn_1()];
                                case 1:
                                    progressRes = _b.sent();
                                    if (!(progressRes.ok === 0)) return [3 /*break*/, 3];
                                    if (!(((_a = JSON.parse(progressRes.data)) === null || _a === void 0 ? void 0 : _a.status) === 9)) return [3 /*break*/, 3];
                                    clearInterval(timer_1);
                                    return [4 /*yield*/, PostRequestData("https://raasr.xfyun.cn/api/getResult", {
                                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                        }, {
                                            app_id: constance_1.APP_ID,
                                            signa: createSign(constance_1.CURRENT_TIME),
                                            ts: constance_1.CURRENT_TIME,
                                            task_id: prepareRes_1.data,
                                        })];
                                case 2:
                                    getResultRes = _b.sent();
                                    if (getResultRes.ok === 0) {
                                        file = fs_1.default.createWriteStream("1.txt");
                                        file.write(constance_1.BANNER + getResultRes.data);
                                    }
                                    _b.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); }, 1000);
                }
                _a.label = 4;
            case 4: return [3 /*break*/, 6];
            case 5:
                _1 = _a.sent();
                console.error("[PostRequestData]::net Error", _1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
