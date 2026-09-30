import httpStatus from "http-status";
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
const paymentConfirmation = async ({ transactionId, userId,}: {transactionId: string;userId: string;}) => {
  let payment;
  const verifyResponse = await verifyPayment(transactionId);
  if (verifyResponse && verifyResponse.pay_status === "Successful") {
    payment = await Payment.create({ userId, transactionId });
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isPremium: true,
          subscriptionStartDate: new Date()
        },
      },
      { new: true }
    );
  }

  return payment;
};
const getAllPaymentsFromDB = async (query: Record<string, unknown>) => {
  // query = (await SearchPaymentByUserQueryMaker(query)) || query;

  // // Date range search
  // query = (await SearchPaymentByDateRangeQueryMaker(query)) || query;

  const userId = query.userId;
  let result;
  if (userId) {
    result = Payment.find({ userId }).populate("userId");
  } else {
    result = Payment.find().populate("userId");
  }
  // const paymentQuery = new QueryBuilder(
  // query
  // )
  //   .filter()
  //   .search(paymentSearchableFields)
  //   .sort()
  //   .paginate()
  //   .fields();

  // const result = await paymentQuery.modelQuery;

  return result;
};

export const PaymentServices = {
  createPayment,
  paymentConfirmation,
  getAllPaymentsFromDB,
};
