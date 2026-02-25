import { DateTime } from "luxon";

export const formatLocalDate = (date: Date, timezone: string) => {
  return DateTime.fromJSDate(date).setZone(timezone).toFormat("yyyy-MM-dd");
};
