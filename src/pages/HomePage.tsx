
import { Button } from "@/components/ui/button";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <h1 className="text-4xl font-bold mb-4">Welcome to your Blank App</h1>
        <p className="text-xl mb-8">This is a fresh start for your application.</p>
        <Button>Get Started</Button>
      </div>
    </div>
  );
};

export default HomePage;
