
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you'd handle authentication here
      console.log("Login attempted with:", email);
    }, 1500);
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-md w-full">
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Login to DevProp Industries</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <p>Don't have an account? Contact your administrator</p>
          </div>
          
          <div className="mt-4 text-center">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
