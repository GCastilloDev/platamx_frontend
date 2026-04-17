const error = {
  response: {
    data: {
      statusCode: 422,
      error: 'Bad Request',
      message: {
        password: [
          'The passorwd must to one letter lower...'
        ]
      }
    }
  }
};

const fallback = 'Fallback';

function getBackendError(error, fallback) {
  const data = error?.response?.data;
  if (!data) return fallback + ' (no data)';

  const msg = data.message;
  if (!msg) {
    if (data.error && typeof data.error === 'string') {
      return data.error;
    }
    return fallback + ' (no msg)';
  }

  if (typeof msg === 'string') {
    return msg;
  }

  if (Array.isArray(msg)) {
    return msg[0] || fallback + ' (empty array msg)';
  }

  if (typeof msg === 'object') {
    const firstKey = Object.keys(msg)[0];
    if (firstKey && Array.isArray(msg[firstKey]) && msg[firstKey].length > 0) {
      return msg[firstKey][0];
    } else if (firstKey && typeof msg[firstKey] === 'string') {
      return msg[firstKey];
    }
  }

  return fallback + ' (obj not matched)';
}

console.log(getBackendError(error, fallback));
