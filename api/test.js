export default function handler(req, res) {
  res.status(200).json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    env: {
      hasJWT: !!process.env.JWT_SECRET,
      hasDB: !!process.env.DATABASE_URL
    }
  });
}