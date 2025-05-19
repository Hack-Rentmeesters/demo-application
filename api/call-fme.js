export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const token = process.env.FME_FLOW_TOKEN;

  const response = await fetch(
    'https://assistent.hackrentmeesters.nl/fmerest/v3/transformations/transact/Dashboards/FME_Situatietekening_Automatisering_Flow_V4_REST_API.fmw',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `fmetoken token=${token}`,
      },
      body: JSON.stringify(req.body),
    }
  );

  const data = await response.json();
  res.status(response.status).json(data);
}
