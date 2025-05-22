export default function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://situatietekening.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
    if (req.method === 'OPTIONS') {
      return res.status(200).end(); // Handle preflight
    }
  
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { username, password } = req.body;
  
    // ✅ Only use environment variables (no fallback!)
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;
  
    if (!validUsername || !validPassword) {
      return res.status(500).json({ error: 'Server misconfigured: missing credentials' });
    }
  
    if (username === validUsername && password === validPassword) {
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }
  