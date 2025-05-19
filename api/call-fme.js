export default async function handler(req, res) {
  console.log("API call-fme invoked");

  if (req.method !== 'POST') {
    console.log("Method not allowed:", req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("Request body:", req.body);
    const token = process.env.FME_FLOW_TOKEN;
    if (!token) {
      console.error("FME_FLOW_TOKEN not set!");
      return res.status(500).json({ error: "Server misconfiguration" });
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
    console.log("FME response text:", text);

    if (!response.ok) {
      return res.status(response.status).json({ error: `FME API error`, details: text });
    }

    const data = JSON.parse(text);

    if (data.status && data.status === "SUCCESS") {
      return res.status(200).json({ message: 'Success!' });
    } else {
      return res.status(400).json({ message: 'FME API failed', data });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}
