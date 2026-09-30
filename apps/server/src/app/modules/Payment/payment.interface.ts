import {  Model, ObjectId } from 'mongoose';

// Interface for the Payment document
export interface IPayment {
  userId: ObjectId;
  transactionId?: string,
}


// Interface for the Payment model (if no static methods)
export type PaymentModel = Model<IPayment>;
