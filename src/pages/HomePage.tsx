import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Building, ChevronRight, GraduationCap, UserCheck, Phone, Check, HelpCircle, MessageCircle, ListChecks, Construction } from "lucide-react";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-white">
              New Zealand's Most Comprehensive Property Development Course
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-white">
              Master the secrets, strategies and techniques that will help you become a successful property developer and realise your own financial freedom.
            </p>
            <p className="text-lg mb-8 text-white">
              100% online - Delivered by formally educated and highly experienced property developers
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-blue-900 hover:bg-gray-200 font-bold">
                <Link to="/contact">Apply Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/modules">View Course</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-black">Our Mission</h2>
            <p className="text-lg mb-8 text-black">
              DevProp Industries is dedicated to providing the highest quality online property development education in New Zealand.
              Delivered by formally educated and highly experienced property developers we focus on providing a comprehensive online learning curriculum which graduates are able to apply step by step to deliver their own projects while working towards their own financial and lifestyle freedom.
            </p>
            
            <h2 className="text-3xl font-bold mb-6 mt-12 text-black">Our Vision</h2>
            <p className="text-lg mb-8 text-black">
              Property developers play an important role in our country's economy and welfare. The industry is responsible for creating hundreds of thousands of jobs each year throughout the complete lifecycle of a development project and most importantly providing the much-needed housing stock to satisfy ever-increasing demand for homes. We want to change people's perspective of property developers in New Zealand which is often associated with greed, dishonesty, lack of care for people and the environment, and prioritising personal profit above all else. The truth is that compared to other industries there are tremendous financial risks but also great rewards to those that successfully navigate the process. We want to help nurture the growth of the next generation ethical property developers who want to both realise their own financial and lifestyle freedom while also delivering much-needed housing options to the New Zealand market with a focus on being ecologically sustainable.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {["Excellence", "Education", "Communication", "Value", "Trust", "Honesty", "Success", "Technology", "Sustainability", "Lifestyle", "Fun", "Ethical"].map((value, index) => (
                <span key={index} className="px-4 py-2 bg-blue-50 text-blue-800 rounded-full font-medium">
                  {value}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">Course Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Comprehensive A-Z System</h3>
              <p className="text-gray-800">
                Learn the fundamentals, theory & application of knowledge in a detailed step by step process over a 6 month period.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Expert Knowledge</h3>
              <p className="text-gray-800">
                A mix of recorded and live content, including live discussions engaging with teachers and classmates to enhance learning.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Industry Resources</h3>
              <p className="text-gray-800">
                Access to a range of industry documents and templates to use on your own projects with extensive student support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Q&A Sessions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <MessageCircle className="h-10 w-10 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-black">Live Q&A Sessions Every Week</h2>
            </div>
            
            <div className="bg-purple-900 p-8 rounded-lg shadow-md">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">Interactive Learning Experience</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-white">Weekly live Q&A sessions with experienced property developers</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-white">Get direct answers to your specific project questions</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-white">Network with other students and share experiences</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-400 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-white">All sessions are recorded for future reference</p>
                    </li>
                  </ul>
                </div>
                <div className="bg-purple-800 p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-white text-center">Join Our Live Sessions</h3>
                  <p className="text-purple-100 mb-6">Our weekly Q&A sessions provide a unique opportunity to get real-time feedback on your property development projects and learn from the experiences of others.</p>
                  <div className="mt-6 text-center">
                    <Button asChild variant="outline" className="bg-white text-purple-900 hover:bg-purple-100 border-none">
                      <Link to="/login">
                        Access Live Q&A Sessions
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step-by-Step Project Guides */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <ListChecks className="h-10 w-10 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-black">Step-by-Step Project Guides</h2>
            </div>
            
            <p className="text-lg text-center mb-10 text-gray-700 max-w-4xl mx-auto">
              Learn how to start your own property development projects with minimal upfront investment. Our course provides detailed, actionable guides that help you minimize costs while maximizing returns.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-3 bg-blue-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-black">Phase 1: Planning</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold mr-2">1</div>
                      <span className="text-gray-800">Market research strategies</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold mr-2">2</div>
                      <span className="text-gray-800">Site identification techniques</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold mr-2">3</div>
                      <span className="text-gray-800">Due diligence checklists</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold mr-2">4</div>
                      <span className="text-gray-800">Initial budget planning</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-3 bg-green-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-black">Phase 2: Financing</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold mr-2">1</div>
                      <span className="text-gray-800">Low-capital entry strategies</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold mr-2">2</div>
                      <span className="text-gray-800">Joint venture structuring</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold mr-2">3</div>
                      <span className="text-gray-800">Investor acquisition framework</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold mr-2">4</div>
                      <span className="text-gray-800">Funding application templates</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-3 bg-purple-600"></div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-black">Phase 3: Execution</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-semibold mr-2">1</div>
                      <span className="text-gray-800">Project management basics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-semibold mr-2">2</div>
                      <span className="text-gray-800">Cost control mechanisms</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-semibold mr-2">3</div>
                      <span className="text-gray-800">Builder negotiation tactics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-semibold mr-2">4</div>
                      <span className="text-gray-800">Exit strategy optimization</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-10 text-center">
              <Button asChild>
                <Link to="/modules" className="inline-flex items-center">
                  Get Full Access to Step-by-Step Guides
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Builders Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center mb-8">
              <Construction className="h-10 w-10 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-black">Builders Resources</h2>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-md mb-8">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-black">Everything You Need To Get Started</h3>
                  <p className="mb-4 text-gray-700">
                    Our extensive network of trusted builders and contractors throughout New Zealand makes finding the right team for your project simple and straightforward.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-800">Vetted network of reliable builders across all regions</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-800">Pre-negotiated contractor rates for course members</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-800">Professional templates for building contracts and agreements</p>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <p className="text-gray-800">Expert guidance on managing builder relationships</p>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-4 text-black">Included Resources</h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Builder Selection Toolkit</p>
                        <p className="text-sm text-gray-600">Compare and evaluate builders with our proprietary toolkit</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Construction Contract Templates</p>
                        <p className="text-sm text-gray-600">Legally-reviewed documents tailored for New Zealand</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 border rounded-md">
                      <div className="bg-blue-100 p-2 rounded-md mr-3">
                        <UserCheck className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-black">Builder Introduction Service</p>
                        <p className="text-sm text-gray-600">Direct introductions to pre-vetted professionals</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button asChild>
                <Link to="/contact">
                  Access Builder Resources
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Structure */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-black">Course Structure</h2>
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <p className="mb-6 text-lg text-black">
                The online course is structured in a sequential manner consisting of 12 learning modules each delivered over 2 weeks, spanning a total period of 24 weeks.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                  <h3 className="font-semibold mb-2 text-black">Introduction</h3>
                  <p className="text-gray-800">Goal setting and motivational planning ensures the necessary skills and mindset to define key objectives, stay motivated, and set the foundation for success.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                  <h3 className="font-semibold mb-2 text-black">Risks and Opportunities</h3>
                  <p className="text-gray-800">General economic and property specific risks you need to know when embarking on a development project. Learn about property cycles, how to mitigate risks and reveal opportunities.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                  <h3 className="font-semibold mb-2 text-black">Research and Due Diligence</h3>
                  <p className="text-gray-800">Master the art of finding lucrative development sites and conducting thorough due diligence research for profitable project identification.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                  <h3 className="font-semibold mb-2 text-black">Valuation of a Development Project</h3>
                  <p className="text-gray-800">Learn valuation methodology and its application to create a framework, build a feasibility model, and ensure the best outcome.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
                  <h3 className="font-semibold mb-2 text-black">Property Development Budgets</h3>
                  <p className="text-gray-800">Comprehend cost considerations at different project stages and effectively manage cash flow throughout the entire project.</p>
                </div>
                
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
                  <h3 className="font-semibold mb-2 text-black">Project Funding</h3>
                  <p className="text-gray-800">Explore funding options for property development projects, and strategies to minimise or eliminate personal equity contributions.</p>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/modules" className="inline-flex items-center">
                    See All 12 Modules
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Whom */}
      <section className="py-16 bg-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10 text-white">Who Is This Course For?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start">
                <div className="bg-blue-800 p-2 rounded-full mr-4">
                  <Check className="h-5 w-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Complete Beginners</h3>
                  <p className="text-blue-200">New to property development but eager to learn the fundamentals and start your journey.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-800 p-2 rounded-full mr-4">
                  <Check className="h-5 w-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Property Investors</h3>
                  <p className="text-blue-200">Looking to expand from buying existing properties to creating value through development.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-800 p-2 rounded-full mr-4">
                  <Check className="h-5 w-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Real Estate Professionals</h3>
                  <p className="text-blue-200">Agents, mortgage brokers, and other industry professionals looking to diversify their skills.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-800 p-2 rounded-full mr-4">
                  <Check className="h-5 w-5 text-blue-200" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-white">Experienced Developers</h3>
                  <p className="text-blue-200">Seeking to fill gaps in knowledge and take their development business to the next level.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-black">Ready to Start Your Property Development Journey?</h2>
            <p className="text-lg mb-8 text-black">
              Call us for full course details, flexible pricing options and book your spot in the next intake now.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/contact" className="inline-flex items-center">
                  <Phone className="mr-2 h-4 w-4" />
                  Talk to Us
                </Link>
              </Button>
              
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/modules">
                  View Course Modules
                </Link>
              </Button>
              
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link to="/faq" className="inline-flex items-center">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Frequently Asked Questions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
