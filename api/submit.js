export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.FME_FLOW_TOKEN;

  const fmeUrl = 'https://assistent.hackrentmeesters.nl/fmerest/v3/transformations/transact/Dashboards/FME_Situatietekening_Automatisering_Flow_V4_REST_API.fmw';

  try {
    const fmeResponse = await fetch(fmeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `fmetoken token=${token}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await fmeResponse.json();
    res.status(fmeResponse.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'FME API error', details: error.message });
  }
}
