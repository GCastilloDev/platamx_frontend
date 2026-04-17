export function getBackendError(error: any, fallback: string): string {
  // Manejamos si error es AxiosError, la Response cruda, o ya es el body
  let data = error?.response?.data || error?.data || error;

  if (!data || typeof data !== 'object') {
    return fallback;
  }

  let finalMsg = fallback;
  const msg = data.message;

  if (!msg) {
    if (data.error && typeof data.error === 'string') {
      finalMsg = data.error;
    }
  } else if (typeof msg === 'string') {
    finalMsg = msg;
  } else if (Array.isArray(msg)) {
    finalMsg = msg[0] || fallback;
  } else if (typeof msg === 'object') {
    const firstKey = Object.keys(msg)[0];
    if (firstKey && Array.isArray(msg[firstKey]) && msg[firstKey].length > 0) {
      finalMsg = msg[firstKey][0];
    } else if (firstKey && typeof msg[firstKey] === 'string') {
      finalMsg = msg[firstKey];
    }
  }

  return finalMsg;
}
