import express from 'express';

const app = express();
const port = 3000;

app.get("/health", async (req, res) => {
  res.status(200).json({ healthy: true });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
  console.log("Press Ctrl+C to quit.");
});