
import Header from "@/components/Header";
import FeaturesSection from "@/components/FeaturesSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Clock, Bot, Zap } from "lucide-react";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Features That <span className="gradient-text">Transform</span> Your Business
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our comprehensive platform provides everything you need to automate customer communication and close more leads.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 mb-20">
            <div>
              <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 h-full">
                <Bot className="h-12 w-12 text-blue-500 mb-6" />
                <h2 className="text-2xl font-bold mb-4">AI-Powered Conversations</h2>
                <p className="text-slate-300 mb-6">
                  Our AI bots leverage OpenAI's advanced language models to create natural, engaging conversations with your leads and customers. They can answer questions, qualify leads, and guide prospects through your sales process automatically.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Natural language understanding and generation</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Context-aware responses based on conversation history</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Customizable conversation flows and templates</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Multi-language support for global businesses</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 h-full">
                <MessageCircle className="h-12 w-12 text-purple-500 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Multi-Channel Communication</h2>
                <p className="text-slate-300 mb-6">
                  Connect with your customers on their preferred platforms. Our bots seamlessly integrate with popular messaging channels to provide consistent experiences and capture leads from various sources.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>WhatsApp Business API integration</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>SMS messaging with delivery tracking</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Email campaigns and automated sequences</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Facebook Messenger integration</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 h-full">
                <Clock className="h-12 w-12 text-green-500 mb-6" />
                <h2 className="text-2xl font-bold mb-4">Time Delay & Scheduling</h2>
                <p className="text-slate-300 mb-6">
                  Create natural conversation flows with intelligent time delays. Schedule messages for optimal timing and automate follow-ups to keep your leads engaged without constant manual intervention.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Customizable delay intervals between messages</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Time zone awareness for global communications</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Smart follow-up sequences based on user engagement</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Calendar integration for appointment scheduling</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 h-full">
                <Zap className="h-12 w-12 text-orange-500 mb-6" />
                <h2 className="text-2xl font-bold mb-4">CRM Integration</h2>
                <p className="text-slate-300 mb-6">
                  Seamlessly connect with Go High Level and other CRM platforms to manage leads, track interactions, and close deals more efficiently. Our integrations ensure your customer data flows smoothly between systems.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Go High Level integration for complete CRM functionality</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Automatic contact creation and updating</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Lead scoring and qualification automation</span>
                  </li>
                  <li className="flex items-start">
                    <Zap className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Deal tracking and pipeline management</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturesSection />
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using our AI bots to grow their customer base and increase revenue
          </p>
          <Button size="lg" className="text-lg py-6 px-8" asChild>
            <Link to="/register">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 border-t border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 mb-4 md:mb-0">
              © {new Date().getFullYear()} AI Bot Platform. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-slate-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;
