import { IDateFormatter } from "../types";

export class DateFormatter implements IDateFormatter {
    public getDateForInput = (date: Date): string => {
        return `${date.getFullYear()}-${this.getMonth(date)}-${this.getDateOfMonth(date)}`;
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