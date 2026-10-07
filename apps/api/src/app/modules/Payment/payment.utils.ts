import dotenv from "dotenv";
import axios from "axios";
import config from "../../config";
import { QueryBuilder } from "../../builder/QueryBuilder";
import { Payment } from "./payment.model";
import { paymentSearchableFields } from "./payment.constant";

dotenv.config();

export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
  const randomNum = Math.floor(Math.random() * 1e12).toString(36); // Generate a random number and convert to base-36
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string

  return `TX-${timestamp}-${randomNum}-${randomString}`.toUpperCase(); // Combine parts and return in uppercase
};
type paymentData = {
  customerName: string;
  customerEmail: string;
};

export const initiatePayment = async (paymentData: paymentData, userId: string) => {
  const { customerName, customerEmail } = paymentData;
  const transactionId = generateTransactionId();
  // Read gateway credentials from the validated config object (not raw process.env)
  // so missing values fail fast at boot instead of at request time.
  const response = await axios.post(
    config.payment_url as string,
    {
      store_id: config.store_Id,
      signature_key: config.signature_key,
      tran_id: transactionId,
      success_url: `${config.server_url}/api/v1/payment/confirmation?transactionId=${transactionId}&userId=${userId}`,
      fail_url: `${config.server_url}/api/v1/payment/failed?transactionId=${transactionId}&userId=${userId}`,
      cancel_url: `${config.client_url}`,
      amount: 20,
      currency: "USD",
      desc: "Merchant Registration Payment",
      cus_name: customerName,
      cus_email: customerEmail,
      cus_add1: `Dhaka,Bangladesh`,
      cus_add2: "N/A",
      cus_city: "N/A",
      cus_state: "N/A",
      cus_postcode: "N/A",
      cus_country: "Bangladesh",
      cus_phone: "N/A",
      type: "json",
    },
    { timeout: 10000 },
  );
  return response.data;
};

export const verifyPayment = async (transactionId: string) => {
  const response = await axios.get(config.payment_verify_url as string, {
    params: {
      store_id: config.store_Id,
      signature_key: config.signature_key,
      request_id: transactionId,
      type: "json",
    },
    timeout: 10000,
  });

  return response.data;
};

export const SearchPaymentByUserQueryMaker = async (query: Record<string, unknown>) => {
  if (query?.searchTerm) {
    const userQuery = new QueryBuilder(Payment.find(), query).search(paymentSearchableFields);

    const payments = await userQuery.modelQuery;

    if (payments && payments.length > 0) {
      const userIds = payments.map((payment) => payment.userId);

      query["userId"] = { $in: userIds };
      /**
       * query['user'] = {
       * $in: [
       * ObjectId('5f7b3b3b4f3c7b0b3c7b0b3c'),
       * ObjectId('5f7b3b3b4f3c7b0b3c7b0b3c'),
       * ]
       */
      delete query.searchTerm;
      return query;
    }
  }
};

export const SearchPaymentByDateRangeQueryMaker = async (query: Record<string, unknown>) => {
  if (query?.from || query?.to) {
    const dateQuery: Record<string, unknown> = {};

    if (query.from) {
      dateQuery["$gte"] = new Date(query.from as string);
    }

    if (query.to) {
      dateQuery["$lte"] = new Date(query.to as string);
    }

    if (Object.keys(dateQuery).length > 0) {
      query["dateFound"] = dateQuery;
    }

    delete query.from;
    delete query.to;
    return query;
  }
  return query;
};
