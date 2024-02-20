const express = require('express');
const cors = require('cors');

const PORT = 4000;
const app = express()

app.use(express.json());
app.use(cors());

const clients = new Set();

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.add(res);
  res.write(`data: ${JSON.stringify({ message: '' })}\n\n`);

  req.on('close', () => {
    clients.delete(res);
    res.end();
  });
});

app.post('/send-message', (req, res) => {
  const { message } = req.body;

  clients.forEach((client) => {
    client.write(`data: ${JSON.stringify({ message })}\n\n`);
  });

  res.end();
});

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on PORT = ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
