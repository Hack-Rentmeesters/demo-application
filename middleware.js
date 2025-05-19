// middleware.js
export function middleware(request) {
  const auth = request.headers.get('authorization');

  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic') {
      const decoded = atob(encoded);
      const [user, pass] = decoded.split(':');
      const validUser = 'admin';
      const validPass = process.env.BASIC_AUTH_PASSWORD;

      if (user === validUser && pass === validPass) {
        return new Response(null, { status: 200 }); // Allow access
      }
    }
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
