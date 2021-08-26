"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.err = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
class FormatDate {
    dateIns;
    constructor() {
        this.dateIns = new Date();
    }
    get year() {
        return this.dateIns.getFullYear();
    }
    get month() {
        return (this.dateIns.getMonth() + 1).toString().padStart(2, "0");
    }
    get date() {
        return this.dateIns.getDate().toString().padStart(2, "0");
    }
    get hours() {
        return this.dateIns.getHours().toString().padStart(2, "0");
    }
    get minutes() {
        return this.dateIns.getMinutes().toString().padStart(2, "0");
    }
    get seconds() {
        return this.dateIns.getSeconds().toString().padStart(2, "0");
    }
    get milliseconds() {
        return this.dateIns.getMilliseconds().toString().padStart(3, "0");
    }
}
const log = (...source) => {
    const dateIns = new FormatDate();
    console.log(chalk_1.default.cyan(`[${dateIns.year}-${dateIns.month}-${dateIns.date} ${dateIns.hours}:${dateIns.minutes}:${dateIns.seconds}:${dateIns.milliseconds}] ${source.join("")}`));
};
exports.log = log;
const err = (...source) => {
    const dateIns = new FormatDate();
    console.error(chalk_1.default.red(`[${dateIns.year}-${dateIns.month}-${dateIns.date} ${dateIns.hours}:${dateIns.minutes}:${dateIns.seconds}:${dateIns.milliseconds}] ${source.join("")}`));
};
exports.err = err;
