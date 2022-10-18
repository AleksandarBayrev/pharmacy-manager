export interface IDateFormatter {
    getDateForInput(date: Date): string;
    getDateForTable(date: Date): string;
    getDateForDateTimeComponent(date: Date): string;
}