// Simple ping endpoint for testing
export default function handler(req, res) {
  res.status(200).json({
    message: 'pong',
    timestamp: new Date().toISOString(),
    method: req.method,
    api: 'axis-thorn-api'
  });
}