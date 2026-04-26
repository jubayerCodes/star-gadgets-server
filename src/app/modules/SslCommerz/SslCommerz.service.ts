import axios from "axios";
import { envVars } from "../../config/env";
import { ISslCommerzInit, ISslCommerzRequest } from "./SslCommerz.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const sslPaymentInit = async (payload: ISslCommerzInit) => {
  try {
    const data: ISslCommerzRequest = {
      store_id: envVars.SSL.SSL_STORE_ID,
      store_passwd: envVars.SSL.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      tran_id: payload.transactionId,
      product_category: "Gadgets",
      product_name: "Star Gadgets",
      success_url: `${envVars.SERVER_URL}${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}`,
      fail_url: `${envVars.SERVER_URL}${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}`,
      cancel_url: `${envVars.SERVER_URL}${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}`,
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.streetAddress,
      cus_city: payload.city,
      cus_state: payload.district,
      cus_postcode: payload.postcode || "N/A",
      cus_country: "Bangladesh",
      cus_phone: payload.phone,
      ship_name: payload.name,
      ship_add1: payload.streetAddress,
      ship_city: payload.city,
      ship_state: payload.district,
      ship_postcode: payload.postcode || "N/A",
      ship_country: "Bangladesh",
      multi_card_name: "mobilebank,internetbank,mastercard,visacard,amexcard",
    };

    const response = await axios({
      method: "POST",
      url: envVars.SSL.SSL_PAYMENT_API,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    });

    return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

export const SslCommerzService = {
  sslPaymentInit,
};
