export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://yourusername.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
  
    // Continue with the login logic
    const { username, password } = req.body;
  
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'secure123';
  
    if (username === validUsername && password === validPassword) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }
  