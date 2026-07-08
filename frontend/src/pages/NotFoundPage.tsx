import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";


export const NotFoundPage = () => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-surface-sunken px-4 text-center">
    <p className="font-display text-6xl font-semibold text-brand-700">404</p>
    <h1 className="mt-3 font-display text-xl font-semibold text-ink">Page not found</h1>
    <p className="mt-1 text-sm text-ink-soft">The page you're looking for doesn't exist.</p>
    <Link to="/" className="mt-6">
      <Button>Go home</Button>
    </Link>
  </div>
);
