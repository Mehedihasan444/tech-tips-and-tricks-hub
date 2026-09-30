import { Schema, model } from "mongoose";
import { IPayment, PaymentModel } from "./payment.interface";

// Define the schema
const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    transactionId:{
      type:String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment, PaymentModel>(
  "Payment",
  PaymentSchema
);
