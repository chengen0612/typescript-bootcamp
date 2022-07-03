enum httpStatusCodes {
  SUCCESS = 200,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
}

const convertStatusCodeToMessage = (statusCode: httpStatusCodes) => {
  const { SUCCESS, UNAUTHORIZED, NOT_FOUND, INTERNAL_ERROR } = httpStatusCodes;
  let message: string;

  switch (statusCode) {
    case UNAUTHORIZED:
      message = "Authentication required";
      break;

    case NOT_FOUND:
      message = "Not found";
      break;

    case INTERNAL_ERROR:
      message = "Internal server error";
      break;

    case SUCCESS:
    default:
      message = "Request succeeded";
  }

  return message;
};

const responseMessage = convertStatusCodeToMessage(200);
console.log("Response message: ", responseMessage);
