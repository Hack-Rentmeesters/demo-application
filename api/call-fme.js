export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'https://ahmadrezaka.github.io'); // Or '*'
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(204).end();
    return;
  }

  // Add CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', 'https://ahmadrezaka.github.io'); // Or '*'

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Your existing logic below
  try {
    const token = process.env.FME_FLOW_TOKEN;
    if (!token) {
      return res.status(500).json({ error: 'Missing API token' });
    }

    const FME_URL = 'https://assistent.hackrentmeesters.nl/fmerest/v3/transformations/transact/Dashboards/FME_Situatietekening_Automatisering_Flow_V4_REST_API.fmw';
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `fmetoken token=${token}`,
    };

    const response = await fetch(FME_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    if (!response.ok) {
      return res.status(response.status).json({ error: text });
    }

    const data = JSON.parse(text);
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
