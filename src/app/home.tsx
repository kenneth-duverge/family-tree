import { Link } from 'react-router';

export default function Index() {
  return (
    <div className="flex flex-col gap-4 size-full">
      <div className="flex gap-4">
        <Link to="/dashboard" className="text-lg">
          Dashboard
        </Link>
        <Link to="/api-tester" className="text-lg">
          API Tester
        </Link>
      </div>
    </div>
  );
}
