import * as dayjs from "dayjs";
import * as utc from "dayjs/plugin/utc";

import { IDateProvider } from "../IDateProvider";

dayjs.extend(utc);

export class DayjsDateProvider implements IDateProvider {
  getDiffInHours(start_date: Date, end_date: Date): number {
    const start_date_utc = this.parseToUTC(start_date);
    const end_date_utc = this.parseToUTC(end_date);
    return dayjs(end_date_utc).diff(start_date_utc, "hours");
  }

  parseToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateNow(): Date {
    return dayjs().toDate();
  }
}
