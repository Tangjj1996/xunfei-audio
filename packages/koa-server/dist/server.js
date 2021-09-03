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
exports.server = void 0;
var koa_1 = __importDefault(require("koa"));
var config_1 = __importDefault(require("./config"));
var node_fetch_1 = __importDefault(require("node-fetch"));
var koa_router_1 = __importDefault(require("koa-router"));
var koa_body_1 = __importDefault(require("koa-body"));
var form_data_1 = __importDefault(require("form-data"));
var fs_1 = __importDefault(require("fs"));
var url_1 = __importDefault(require("url"));
var app = new koa_1.default();
var router = new koa_router_1.default();
function server() {
    var _this = this;
    return new Promise(function (resolve, reject) {
        app.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        ctx.set("Access-Control-Allow-Origin", ctx.req.headers.origin);
                        ctx.set("Access-Control-Allow-Headers", "Content-Type, Content-Length");
                        ctx.set("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
                        ctx.set("Access-Control-Allow-Credentials", "true");
                        if (!(ctx.method === "OPTIONS")) return [3 /*break*/, 1];
                        ctx.body = 200;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, next()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); });
        var _loop_1 = function (key) {
            router.post(key, (0, koa_body_1.default)({ multipart: key === "/api/upload" }), function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
                var isMutipart, formData, key_1, key_2, rawFetchRes, jsonFetchRes;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            isMutipart = key === "/api/upload";
                            formData = new form_data_1.default();
                            if (isMutipart) {
                                for (key_1 in ctx.request.body) {
                                    formData.append(key_1, ctx.request.body[key_1]);
                                }
                                for (key_2 in ctx.request.files) {
                                    formData.append(key_2, fs_1.default.createReadStream(ctx.request.files[key_2]["path"]));
                                }
                            }
                            return [4 /*yield*/, (0, node_fetch_1.default)(config_1.default[key], {
                                    body: isMutipart ? formData : new url_1.default.URLSearchParams(ctx.request.body),
                                    method: "POST",
                                })];
                        case 1:
                            rawFetchRes = _a.sent();
                            return [4 /*yield*/, rawFetchRes.json()];
                        case 2:
                            jsonFetchRes = _a.sent();
                            ctx.body = jsonFetchRes;
                            next();
                            return [2 /*return*/];
                    }
                });
            }); });
        };
        for (var key in config_1.default) {
            _loop_1(key);
        }
        app.use(router.routes()).use(router.allowedMethods());
        app.listen(3000, function () {
            resolve({ ok: 0 });
            console.log("listener on 3000 successfully");
        });
    });
}
exports.server = server;
