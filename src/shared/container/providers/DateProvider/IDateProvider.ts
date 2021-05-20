export interface IDateProvider {
  getDiffInHours(start_date: Date, end_date: Date): number;
  parseToUTC(date: Date): string;
  dateNow(): Date;
  getDiffInDays(start_date: Date, end_date: Date): number;
}
