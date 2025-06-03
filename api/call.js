const FME_URLS = {
  default: process.env.FME_API_URL,
  situatietekening: process.env.FME_Situatietekening_URL,
  factsheet: process.env.FME_FACTSHEET_URL
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://hack-rentmeesters.github.io'); // Or '*'
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
    return;
  }

  // Add CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', 'https://hack-rentmeesters.github.io'); // Or '*'

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  
  try {
    const token = process.env.FME_FLOW_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Missing API token' });
    }

    // Get the application type from the request body
    const { applicationType = 'default', ...requestBody } = req.body;

    // Get the appropriate FME URL based on the application type
    const fmeUrl = FME_URLS[applicationType] || FME_URLS.default;

    if (!fmeUrl) {
      return res.status(400).json({ error: 'Invalid application type' });
    }

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `fmetoken token=${token}`,
    };

    const response = await fetch(fmeUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: text });
    }

    const data = JSON.parse(text);
    res.status(200).json(data);

  } catch (error) {
    console.error('Error calling FME:', error);
    res.status(500).json({ error: 'Failed to call FME API' });
  }
}
