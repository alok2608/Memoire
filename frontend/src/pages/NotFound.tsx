import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white space-y-6">
      <h1 className="text-6xl font-extrabold">404</h1>
      <p className="text-2xl">Page not found</p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700">
        <Link to="/">← Back to Dashboard</Link>
      </Button>
    </div>
  );
}
