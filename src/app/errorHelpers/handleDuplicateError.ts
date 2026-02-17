/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interfaces/error.interface";

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  // Extract the field/property name from keyValue object
  // e.g. keyValue: { email: 'test@example.com' }
  const propertyName = err.keyValue ? Object.keys(err.keyValue)[0] : "Field";

  const errorSources: TErrorSources = [
    {
      path: propertyName,
      message: `"${propertyName}" is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: `"${propertyName}" is already exists`,
    errorSources,
  };
};

export default handleDuplicateError;
