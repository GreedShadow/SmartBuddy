import app from '../server/src/app.js';
import demoHandler from '../client/api/[...path].js';

export default function handler(req, res) {
  if (process.env.VERCEL && !process.env.DB_HOST) {
    return demoHandler(req, res);
  }

  return app(req, res);
}
