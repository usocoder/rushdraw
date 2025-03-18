
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface ModuleProps {
  number: number;
  title: string;
  description: string;
  available: boolean;
}

const ModuleItem = ({ number, title, description, available }: ModuleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={`card p-6 mb-4 ${!available ? 'opacity-70' : ''}`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">
          Module {number} - {title}
        </h3>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            {isOpen ? "Show Less" : "Show More"}
          </Button>
        </CollapsibleTrigger>
      </div>
      
      <CollapsibleContent>
        <div className="mt-4">
          <p className="mb-4">{description}</p>
          {available ? (
            <Button asChild>
              <Link to={`/module/${number}`}>Start Module</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to="/contact">Contact Us Now</Link>
            </Button>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const ModulesPage = () => {
  const modules: ModuleProps[] = [
    {
      number: 0,
      title: "Introduction – Goal setting and motivational planning",
      description: "Goal setting and motivational planning ensures the necessary skills and mindset to define key objectives, stay motivated, and set the foundation for success.",
      available: false,
    },
    {
      number: 1,
      title: "Risks and opportunities",
      description: "General economic and property specific risks you need to know when embarking on a development project. Learn about property cycles, how to mitigate risks and reveal opportunities.",
      available: false,
    },
    {
      number: 2,
      title: "Research, due diligence and acquisition",
      description: "Master the art of finding lucrative development sites and conducting thorough due diligence research for profitable project identification.",
      available: false,
    },
    {
      number: 3,
      title: "Valuation of a development project",
      description: "Learn valuation methodology and its application to create a framework, build a feasibility model, and ensure the best outcome.",
      available: false,
    },
    {
      number: 4,
      title: "Development budgets and forecasting",
      description: "Comprehend cost considerations at different project stages and effectively manage cash flow throughout the entire project.",
      available: false,
    },
    {
      number: 5,
      title: "Property development project funding",
      description: "Explore funding options for property development projects, and strategies to minimise or eliminate personal equity contributions.",
      available: false,
    },
    {
      number: 6,
      title: "Structuring project entities",
      description: "Optimise the best structure to limit your personal liability, protect your assets and create a favourable tax position while providing investors with a high level of security.",
      available: false,
    },
    {
      number: 7,
      title: "Project programming and forecasting",
      description: "Master the accurate forecasting of tasks and time which is essential to understanding and managing the critical path of a project.",
      available: false,
    },
    {
      number: 8,
      title: "Statutory approvals and processes",
      description: "Successfully navigate the process of obtaining necessary approvals which are required during the planning, design, and certification of a development project.",
      available: false,
    },
    {
      number: 9,
      title: "Detailed design coordination",
      description: "Efficiently coordinate complex design details with a cohesive design team to achieve significant time and cost benefits.",
      available: false,
    },
    {
      number: 10,
      title: "Project marketing",
      description: "Master effective project marketing strategies, including presales requirements, to navigate the marketing and sales process successfully.",
      available: false,
    },
    {
      number: 11,
      title: "Managing the construction stage",
      description: "Understanding the typical processes and fast pace of a live construction project, including the monthly claims and assessment process to ensure work continues smoothly. Acquire the skills to effectively scope work, tender fee proposals and negotiate contracts to ensure clarity of outcome and minimise variation risks.",
      available: false,
    },
    {
      number: 12,
      title: "Project completion",
      description: "Master the completion and project wrap-up process, ensuring meticulous attention to detail, effective communication, and timely acquisition of required certificates.",
      available: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link to="/">← Back to Home</Link>
        </Button>
        
        <h1 className="text-4xl font-bold mb-8 gradient-text">Course Modules</h1>
        
        <div className="mb-8">
          <p className="mb-4">
            The online course is structured in a sequential manner consisting of 12 learning modules each delivered over 2 weeks, spanning a total period of 24 weeks.
          </p>
          <p>
            Modules marked as "Contact Us Now" require enrollment. Click to get in touch with our team for more information.
          </p>
        </div>
        
        <div>
          {modules.map((module) => (
            <ModuleItem 
              key={module.number}
              number={module.number}
              title={module.title}
              description={module.description}
              available={module.available}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModulesPage;
