// pages/api/data.js

export default function handler(req, res) {
    if (req.method === 'GET') {
      // Handle GET request
      res.status(200).json({ data: 'This is a GET request' });
    } else if (req.method === 'POST') {
      // Handle POST request
      const { body } = req;
      res.status(201).json({ data: `You sent: ${body}` });
    } else {
      // Handle other methods
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  