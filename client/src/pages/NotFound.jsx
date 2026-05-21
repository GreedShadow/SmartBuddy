import { Link } from 'react-router-dom';
export default function NotFound() {
  return <div className="card p-8 text-center"><h1 className="text-2xl font-bold">Page not found</h1><p className="mt-2 text-slate-500">The page you opened does not exist.</p><Link className="btn-primary mt-5" to="/dashboard">Back to dashboard</Link></div>;
}
