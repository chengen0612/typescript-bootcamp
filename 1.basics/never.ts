function generateError(message: string, errorCode: number): never {
  throw { message, errorCode };
}

generateError("Resource not found!", 404);
