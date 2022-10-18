import { enhanceClass } from "../base/enhanceClass";
import { ITimeFormatter } from "../types";

class TimeFormatter implements ITimeFormatter {
    public getTimeForDateTimeComponent(date: Date) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const hoursFormatted = hours < 10 ? `0${hours}` : hours;
        const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes;
        const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds;
        return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
    }
}

enhanceClass(TimeFormatter, "TimeFormatter");

export { TimeFormatter };