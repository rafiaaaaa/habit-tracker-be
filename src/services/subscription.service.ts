import { DateTime } from "luxon";
import Subscription, { ISubscription } from "../models/Subscription";
import User from "../models/User";

export const createSubscriptionService = async (
  userId: string,
  plan: string,
): Promise<ISubscription> => {
  const user = await User.findById(userId);

  const today = DateTime.now().setZone(user!.timezone).toUTC().toJSDate();

  const subscription = Subscription.create({
    user: userId,
    plan,
    status: "active",
    startDate: today,
    endDate: today.setMonth(today.getMonth() + 1),
  });

  return subscription;
};
