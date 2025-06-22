import { Outlet } from "react-router-dom";
import { useAuthCheck } from "./hooks/useAuthCheck";

function App() {
  const { isLoading } = useAuthCheck();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full size-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-dark-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}

export default App;
