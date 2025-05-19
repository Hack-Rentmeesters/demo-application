// api/protect.js

export default function handler(req, res) {
  const auth = req.headers.authorization || '';

  const [scheme, encoded] = auth.split(' ');
  if (scheme !== 'Basic' || !encoded) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.status(401).send('Authentication required.');
  }

  const decoded = Buffer.from(encoded, 'base64').toString();
  const [user, pass] = decoded.split(':');

  const validUser = 'admin';
  const validPass = process.env.BASIC_AUTH_PASSWORD;

  if (user === validUser && pass === validPass) {
    res.status(200).send('Authenticated');
  } else {
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    res.status(401).send('Unauthorized');
  }
}
