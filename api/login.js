export default function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  
    const { username, password } = req.body;
  
    // Ideally, store these in environment variables
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'secure123';
  
    if (username === validUsername && password === validPassword) {
      // Simple token — for real production use JWT or sessions
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  }
  