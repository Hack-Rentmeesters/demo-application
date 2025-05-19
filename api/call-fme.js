export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { publishedParameters } = req.body;

    const token = process.env.FME_FLOW_TOKEN;
    const response = await fetch('https://your-fme-url/fmerest/v3/transformations/submitSync/situatietekening', {
      method: 'POST',
      headers: {
        'Authorization': `fmetoken ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ publishedParameters })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
