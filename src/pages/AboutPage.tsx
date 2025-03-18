
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">← Back to Home</Link>
        </Button>
        
        <h1 className="text-4xl font-bold mb-8 gradient-text">About This Course</h1>
        
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Welcome to DevProp Industries</h2>
          <p className="mb-4">
            Congratulations and welcome to the DevProp Industries comprehensive online property development course!
          </p>
          <p>
            Education is the foundation for building successful careers and lives. It is the most important investment one can make in their future. A good education can open doors to new opportunities, increase earning potential, enhance critical thinking skills, and boost confidence. It equips individuals with the knowledge and skills necessary to navigate and succeed in the complex world we live in today.
          </p>
        </div>
        
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Course Structure</h2>
          <p className="mb-4">
            The online course is structured in a sequential manner consisting of 12 learning modules each delivered over 2 weeks, spanning a total period of 24 weeks.
          </p>
          <p>
            Access to each learning module is released in line with the course schedule and your course commencement date, see the course schedule document for more information. Future modules which are pending access will show as "coming soon".
          </p>
        </div>
        
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Homework Tasks</h2>
          <p className="mb-4">
            With each module students will be given homework tasks to complete as a chance to apply new skills and knowledge.
          </p>
          <p className="mb-4">
            To keep these lessons practical, choose a geographic area and type of development you would like to pursue in real life, for example a duplex or townhouse development in your local Council, or a small subdivision in an emerging area. This will be your development strategy for the duration of the course, make all homework tasks applicable to your chosen strategy.
          </p>
          <p>
            Make sure you have completed the homework tasks prior to the live Q&A sessions for each module as that is the opportunity to share your learning and experience. This is an opportunity to learn from your classmates' experience as well as your own.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Button asChild size="lg">
            <Link to="/modules">Explore Modules</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
