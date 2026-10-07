import httpStatus from "http-status";
import { Types } from "mongoose";
import AppError from "../../errors/AppError";
import { Payment } from "./payment.model";
import {
  initiatePayment,
  // SearchPaymentByDateRangeQueryMaker,
  // SearchPaymentByUserQueryMaker,
  verifyPayment,
} from "./payment.utils";
import { User } from "../User/user.model";
// import { paymentSearchableFields } from "./payment.constant";
// import { QueryBuilder } from "../../builder/QueryBuilder";

type TPayment = {
  userId: string;
};
const createPayment = async (payload: TPayment) => {
  const userId = payload.userId;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const paymentData = {
    customerName: user?.name,
    customerEmail: user?.email,
  };
  const paymentSession = await initiatePayment(paymentData, userId);

  return paymentSession;
};
const paymentConfirmation = async ({
  transactionId,
  userId,
}: {
  transactionId: string;
  userId: string;
}) => {
  const verifyResponse = await verifyPayment(transactionId);
  if (!verifyResponse || verifyResponse.pay_status !== "Successful") {
    throw new AppError(httpStatus.BAD_REQUEST, "Payment verification failed");
  }
  const payment = await Payment.create({
    userId: new Types.ObjectId(userId),
    transactionId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
  await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isPremium: true,
        subscriptionStartDate: new Date(),
      },
    },
    { returnDocument: "after" },
  );

  return payment;
};
const getAllPaymentsFromDB = async (query: Record<string, unknown>) => {
  // query = (await SearchPaymentByUserQueryMaker(query)) || query;

  // // Date range search
  // query = (await SearchPaymentByDateRangeQueryMaker(query)) || query;

  const userId = query.userId;
  if (userId) {
    return Payment.find({ userId }).populate("userId");
  }
  return Payment.find().populate("userId");
};

export const PaymentServices = {
  createPayment,
  paymentConfirmation,
  getAllPaymentsFromDB,
};
