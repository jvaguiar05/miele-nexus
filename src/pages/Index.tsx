import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page
    navigate("/home");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
}