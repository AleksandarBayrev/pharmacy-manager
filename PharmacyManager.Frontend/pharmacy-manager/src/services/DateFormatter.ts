import { enhanceClass } from "../base/enhanceClass";
import { IDateFormatter } from "../types";

class DateFormatter implements IDateFormatter {
    public getDateForInput = (date: Date): string => {
        return `${date.getFullYear()}-${this.getMonth(date)}-${this.getDateOfMonth(date)}`;
    }

    public getDateForTable = (date: Date): string => {
        return `${this.getDateOfMonth(date)}.${this.getMonth(date)}.${date.getFullYear()}`;
    }

    public getDateForDateTimeComponent(date: Date): string {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
    
            const dayFormatted = day < 10 ? `0${day}` : day;
            const monthFormatted = month < 10 ? `0${month}` : month;
            return `${dayFormatted}.${monthFormatted}.${year}`;
    }

    private getMonth(date: Date): string {
        const month = date.getMonth() + 1;
        return month < 10 ? `0${month}` : month.toString();
    }

    private getDateOfMonth(date: Date): string {
        const dateOfMonth = date.getDate();
        return dateOfMonth < 10 ? `0${dateOfMonth}` : `${dateOfMonth}`;
    }
}

enhanceClass(DateFormatter, "DateFormatter");

export { DateFormatter }