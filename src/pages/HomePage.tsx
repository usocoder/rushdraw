
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Dev Pro Industries New Zealand</h1>
        <p className="text-xl mb-8">Comprehensive Property Development Course</p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/about">About the Course</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/modules">View Modules</Link>
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Course?</h2>
          <p className="mb-4">
            Whether you are a passive investor or an active developer, we are excited to help you achieve your wildest property dreams!
          </p>
          <p>
            Education is the foundation for building successful careers and lives. It is the most important investment one can make in their future.
          </p>
        </div>
        <div className="card p-6">
          <h2 className="text-2xl font-bold mb-4">Course Structure</h2>
          <p className="mb-4">
            The online course is structured in a sequential manner consisting of 12 learning modules each delivered over 2 weeks, spanning a total period of 24 weeks.
          </p>
          <Button asChild variant="secondary" className="mt-2">
            <Link to="/modules">Explore Modules</Link>
          </Button>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Getting Started</h2>
        <div className="card p-6">
          <p className="mb-4">
            On first arrival please check out the material provided in the introduction folder, which includes videos, course delivery information and course material to get started on straight away such as the goal setting and mindset training module which is key for all subsequent learning modules.
          </p>
          <p>
            Access to each learning module is released in line with the course schedule and your course commencement date, see the course schedule document for more information. Future modules which are pending access will show as "coming soon".
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
