import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
import config from "../../config";
import { Request, Response } from "express"; // Ensure you have the necessary imports

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const payment = await PaymentServices.createPayment(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment Created Successfully",
    data: payment,
  });
});

const paymentConfirmation = catchAsync(async (req: Request, res: Response) => {
  const transactionId = req.query.transactionId as string;
  const userId = req.query.userId as string;
  if (!transactionId || !userId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send("Invalid transaction or user ID");
  }

  await PaymentServices.paymentConfirmation({
    transactionId,
    userId,
  });

  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f9;
          }
          .container {
            text-align: center;
            padding: 50px;
            background: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          h1 {
            color: #4CAF50;
            font-size: 2.5em;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.2em;
            color: #555555;
            margin-bottom: 30px;
          }
          .button {
            background-color: #4CAF50;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.1em;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #45a049;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Success</h1>
          <p>Thank you for your payment! Your transaction has been successfully completed.</p>
          <a href="${config.client_url}" class="button">Go to Home</a>
        </div>
      </body>
    </html>
  `);
});

const paymentFailed = catchAsync(async (req: Request, res: Response) => {
  res.send(`
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f4f4f9;
          }
          .container {
            text-align: center;
            padding: 50px;
            background: #ffffff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
          }
          h1 {
            color: #E74C3C;
            font-size: 2.5em;
            margin-bottom: 20px;
          }
          p {
            font-size: 1.2em;
            color: #555555;
            margin-bottom: 30px;
          }
          .button {
            background-color: #E74C3C;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 5px;
            font-size: 1.1em;
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #C0392B;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Failed</h1>
          <p>We're sorry, but your payment could not be processed. Please try again.</p>
          <a href="${config.client_url}/subscription" class="button">Retry Payment</a>
        </div>
      </body>
    </html>
  `);
});
const getAllPayments = catchAsync(async (req, res) => {
  const payment = await PaymentServices.getAllPaymentsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment retrieved successfully",
    data: payment,
  });
});

export const PaymentControllers = {
  createPayment,
  paymentConfirmation,
  paymentFailed,
  getAllPayments,
};
