import { stripe } from "../config/stripe";
import Subscription from "../models/Subscription";
import User from "../models/User";
import { AppError } from "../utils/AppError";

const FE_URL = process.env.FE_URL || "http://localhost:5173";
export const createPaymentLinkService = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new AppError("User not found", 404);

  const paymentLink = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID || "",
        quantity: 1,
      },
    ],
    metadata: {
      user_id: userId,
      user_email: user.email,
    },
    success_url: `${FE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FE_URL}/payment/cancel`,
  });
  console.log(paymentLink);
  return {
    url: paymentLink.url,
  };
};

export const paymentWebhook = async (event: any) => {
  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object;
      const userId = invoice.metadata.user_id;

      await Subscription.updateOne(
        { user: userId },
        {
          status: "active",
          plan: "PRO",
        },
      );
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      const userId = invoice.metadata.userId;

      await Subscription.updateOne(
        { user: userId },
        {
          plan: "FREE",
          status: "active",
        },
      );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;

      await Subscription.updateOne(
        { user: userId },
        {
          plan: "FREE",
          status: "active",
        },
      );
      break;
    }
  }
  return true;
};

export const verifySessionService = async (
  userId: string,
  sessionId: string,
) => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new AppError("Session not found", 404);
  }

  if (session.metadata?.user_id !== userId) {
    throw new AppError("Session not found", 404);
  }

  if (session.payment_status !== "paid") {
    throw new AppError("Payment not completed", 400);
  }

  await Subscription.updateOne(
    { user: userId },
    {
      status: "active",
      plan: "PRO",
    },
  );
};
