const StatusCodes = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  TEMPORARY_REDIRECT: 307,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  UNSUPPORTED_MEDIA_TYPE: 415,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const ReasonPhrases = {
  OK: 'Ok',
  CREATED: 'Created',
  ACCEPTED: 'Accepted',
  TEMPORARY_REDIRECT: 'Temporary Redirect',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  METHOD_NOT_ALLOWED: 'Method Not Allowed',
  REQUEST_TIMEOUT: 'Request Timeout',
  UNSUPPORTED_MEDIA_TYPE: 'Unsupported Media Type',
  TOO_MANY_REQUESTS: 'Too Many Requests',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  SERVICE_UNAVAILABLE: 'Service Unavailable',
};

const statusCodeToReasonPhrase = {
  '200': 'Ok',
  '201': 'Created',
  '202': 'Accepted',
  '307': 'Temporary Redirect',
  '400': 'Bad Request',
  '401': 'Unauthorized',
  '403': 'Forbidden',
  '404': 'Not Found',
  '405': 'Method Not Allowed',
  '408': 'Request Timeout',
  '415': 'Unsupported Media Type',
  '429': 'Too Many Requests',
  '500': 'Internal Server Error',
  '503': 'Service Unavailable',
};

const getReasonPhrase = (statusCode) => {
  const result = statusCodeToReasonPhrase[statusCode.toString()];
  if (!result) {
    throw new Error(`Status code does not exist: ${statusCode}`);
  }
  return result;
};

export { StatusCodes, ReasonPhrases, getReasonPhrase };
