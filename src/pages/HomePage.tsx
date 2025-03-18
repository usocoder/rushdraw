
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Building, ChevronRight, GraduationCap, UserCheck } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Dev Pro Industries New Zealand
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Comprehensive Property Development Course
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-200">
                <Link to="/about">About the Course</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/modules">View Modules</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Course?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Knowledge</h3>
              <p className="text-gray-600">
                Gain insights from industry professionals with years of experience in property development.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Practical Skills</h3>
              <p className="text-gray-600">
                Learn actionable strategies that you can apply immediately to your property development projects.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Supportive Community</h3>
              <p className="text-gray-600">
                Connect with like-minded individuals and build a network of property development professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Course Structure</h2>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <p className="mb-6 text-lg">
                The online course is structured in a sequential manner consisting of 12 learning modules each delivered over 2 weeks, spanning a total period of 24 weeks.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p><span className="font-medium">Introduction:</span> Goal setting and motivational planning to establish the foundation for success.</p>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p><span className="font-medium">Module 1-4:</span> Risk assessment, due diligence, valuation methodology, and development budgets.</p>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p><span className="font-medium">Module 5-8:</span> Project funding, entity structuring, project programming, and statutory approvals.</p>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <p><span className="font-medium">Module 9-12:</span> Design coordination, project marketing, construction management, and project completion.</p>
                </li>
              </ul>
              <div className="mt-8 text-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/modules" className="inline-flex items-center">
                    Explore All Modules
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Getting Started</h2>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-start mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Introduction Materials</h3>
                  <p className="text-gray-600">
                    On first arrival please check out the material provided in the introduction folder, which includes videos, course delivery information and course material to get started on straight away such as the goal setting and mindset training module which is key for all subsequent learning modules.
                  </p>
                </div>
              </div>
              
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-blue-700">
                  Access to each learning module is released in line with the course schedule and your course commencement date. Future modules which are pending access will show as "coming soon".
                </p>
              </div>
              
              <div className="mt-8 flex justify-center gap-4">
                <Button asChild>
                  <Link to="/login">Login to Access Course</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/contact">Contact for Enrollment</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
