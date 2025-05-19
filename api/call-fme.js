// Inside your backend route handler
app.post("/submit", async (req, res) => {
  console.log("Received from frontend:", req.body);
  res.json({ status: "Frontend to backend is working", data: req.body });
});
