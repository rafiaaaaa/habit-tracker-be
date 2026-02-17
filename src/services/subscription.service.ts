import { DateTime } from "luxon";
import Subscription, { ISubscription } from "../models/Subscription";
import User from "../models/User";

export const createSubscriptionService = async (
  userId: string,
  plan: string,
): Promise<ISubscription> => {
  const user = await User.findById(userId);

  const today = DateTime.now().setZone(user!.timezone).toUTC().toJSDate();

  const subscription = await Subscription.findOneAndUpdate(
    { user: userId },
    {
      user: userId,
      plan,
      status: "active",
      startDate: today,
      endDate: today.setMonth(today.getMonth() + 1),
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  if (!subscription) {
    throw new Error(`Subscription not created for user ${userId}`);
  }

  return subscription;
};
