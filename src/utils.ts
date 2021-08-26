import chalk from "chalk";

class FormatDate {
    private dateIns: Date;
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

export const log = (...source: unknown[]) => {
    const dateIns = new FormatDate();

    console.log(
        chalk.cyan(
            `[${dateIns.year}-${dateIns.month}-${dateIns.date} ${dateIns.hours}:${dateIns.minutes}:${dateIns.seconds}:${
                dateIns.milliseconds
            }] ${source.join("")}`
        )
    );
};

export const err = (...source: unknown[]) => {
    const dateIns = new FormatDate();

    console.error(
        chalk.red(
            `[${dateIns.year}-${dateIns.month}-${dateIns.date} ${dateIns.hours}:${dateIns.minutes}:${dateIns.seconds}:${
                dateIns.milliseconds
            }] ${source.join("")}`
        )
    );
};
