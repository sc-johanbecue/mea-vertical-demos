export async function register() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  if (process.env.AUTH0_INSECURE_TLS === 'true' || process.env.AUTH0_INSECURE_TLS === '1') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
}
