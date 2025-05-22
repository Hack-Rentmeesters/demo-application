// /api/login.js

export default function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
  
    const { username, password } = req.body;
  
    const validUsers = {
      admin: 'yourStrongPassword123',
      // Add more users if needed
    };
  
    if (validUsers[username] && validUsers[username] === password) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, error: "Invalid credentials" });
    }
  }
  