"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = exports.log = void 0;
var chalk_1 = __importDefault(require("chalk"));
var FormatDate = /** @class */ (function () {
    function FormatDate() {
        this.dateIns = new Date();
    }
    Object.defineProperty(FormatDate.prototype, "year", {
        get: function () {
            return this.dateIns.getFullYear();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormatDate.prototype, "month", {
        get: function () {
            return (this.dateIns.getMonth() + 1).toString().padStart(2, "0");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormatDate.prototype, "date", {
        get: function () {
            return this.dateIns.getDate().toString().padStart(2, "0");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormatDate.prototype, "hours", {
        get: function () {
            return this.dateIns.getHours().toString().padStart(2, "0");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormatDate.prototype, "minutes", {
        get: function () {
            return this.dateIns.getMinutes().toString().padStart(2, "0");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormatDate.prototype, "seconds", {
        get: function () {
            return this.dateIns.getSeconds().toString().padStart(2, "0");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(FormatDate.prototype, "milliseconds", {
        get: function () {
            return this.dateIns.getMilliseconds().toString().padStart(3, "0");
        },
        enumerable: false,
        configurable: true
    });
    return FormatDate;
}());
var log = function () {
    var source = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        source[_i] = arguments[_i];
    }
    var dateIns = new FormatDate();
    console.log(chalk_1.default.cyan("[" + dateIns.year + "-" + dateIns.month + "-" + dateIns.date + " " + dateIns.hours + ":" + dateIns.minutes + ":" + dateIns.seconds + ":" + dateIns.milliseconds + "] " + source.join("")));
};
exports.log = log;
var err = function () {
    var source = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        source[_i] = arguments[_i];
    }
    var dateIns = new FormatDate();
    console.error(chalk_1.default.red("[" + dateIns.year + "-" + dateIns.month + "-" + dateIns.date + " " + dateIns.hours + ":" + dateIns.minutes + ":" + dateIns.seconds + ":" + dateIns.milliseconds + "] " + source.join("")));
};
exports.err = err;
