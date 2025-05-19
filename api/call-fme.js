// File: api/call-fme.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const token = process.env.FME_FLOW_TOKEN;

  try {
    const fmeResponse = await fetch('https://assistent.hackrentmeesters.nl/fmerest/v3/transformations/submit/Dashboards/FME_Situatietekening_Automatisering_Flow_V4_REST_API.fmw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `fmetoken token=${token}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await fmeResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong with the FME call.' });
  }
}
