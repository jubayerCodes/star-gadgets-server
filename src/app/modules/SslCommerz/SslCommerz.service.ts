import axios from "axios";
import { envVars } from "../../config/env";
import { ISslCommerzInit, ISslCommerzRequest } from "./SslCommerz.interface";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const sslPaymentInit = async (payload: ISslCommerzInit) => {
  try {
    // Use dedicated shipping address for ship_* fields when provided; else fall back to billing
    const ship = payload.shipping;

    const data: ISslCommerzRequest = {
      store_id: envVars.SSL.SSL_STORE_ID,
      store_passwd: envVars.SSL.SSL_STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      ipn_url: `${envVars.SSL.SSL_IPN_URL}`,
      tran_id: payload.transactionId,
      product_category: "Gadgets",
      product_name: "Star Gadgets",
      success_url: `${envVars.SERVER_URL}${envVars.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}`,
      fail_url: `${envVars.SERVER_URL}${envVars.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}`,
      cancel_url: `${envVars.SERVER_URL}${envVars.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}`,
      // Customer (billing) fields
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.streetAddress,
      cus_city: payload.city,
      cus_state: payload.district,
      cus_postcode: payload.postcode || "N/A",
      cus_country: "Bangladesh",
      cus_phone: payload.phone,
      // Shipping fields — use dedicated shipping address if provided, else use billing
      ship_name: ship?.name ?? payload.name,
      ship_add1: ship?.streetAddress ?? payload.streetAddress,
      ship_city: ship?.city ?? payload.city,
      ship_state: ship?.district ?? payload.district,
      ship_postcode: ship?.postcode ?? payload.postcode ?? "N/A",
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
