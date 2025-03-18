
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import PricingSection from "@/components/PricingSection";
import FeaturesSection from "@/components/FeaturesSection";
import { Link } from "react-router-dom";
import { ArrowRight, Bot, MessageSquare, Zap } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Create <span className="gradient-text">Intelligent AI Bots</span> that Close Leads for You
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
            Automate your customer communications across WhatsApp, Email, SMS, and Facebook using advanced AI
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-16">
            <Button size="lg" className="text-lg py-6 px-8" asChild>
              <Link to="/register">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg py-6 px-8" asChild>
              <Link to="/features">
                View Features
              </Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="card">
              <div className="mb-4 bg-blue-500/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Bots</h3>
              <p className="text-slate-400">Create intelligent bots using OpenAI's advanced language models</p>
            </div>
            <div className="card">
              <div className="mb-4 bg-purple-500/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <MessageSquare className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Channel</h3>
              <p className="text-slate-400">Connect with customers on WhatsApp, Email, SMS, and Facebook</p>
            </div>
            <div className="card">
              <div className="mb-4 bg-green-500/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lead Conversion</h3>
              <p className="text-slate-400">Automate follow-ups and close more deals with smart sequences</p>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturesSection />
      <PricingSection />
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Automate Your Lead Generation?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Start building your AI bots today and transform your business communications
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

export default HomePage;
