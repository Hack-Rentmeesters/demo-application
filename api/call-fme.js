export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const FME_URL = 'https://assistent.hackrentmeesters.nl/fmerest/v3/transformations/transact/Dashboards/FME_Situatietekening_Automatisering_Flow_V4_REST_API.fmw';

  const token = process.env.FME_FLOW_TOKEN; // Stored securely in Vercel
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `fmetoken token=${token}`,
  };

  try {
    const response = await fetch(FME_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (data.status && data.status === "SUCCESS") {
      return res.status(200).json({ message: 'Success!' });
    } else {
      return res.status(400).json({ message: 'FME API failed', data });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
