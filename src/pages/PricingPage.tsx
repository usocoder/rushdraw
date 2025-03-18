
import Header from "@/components/Header";
import PricingSection from "@/components/PricingSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Choose the plan that's right for your business with our one-time payment options. No subscriptions, no hidden fees.
            </p>
          </div>
          
          <div className="bg-slate-800/60 p-8 rounded-xl border border-slate-700/50 mb-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">All Plans Include:</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Lifetime access - no subscriptions</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>OpenAI integration</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Time delay feature</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Free upgrades and improvements</span>
              </div>
              <div className="flex items-start">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Basic messaging integrations</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <PricingSection />
      
      {/* FAQ Section */}
      <section className="py-16 bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Get answers to commonly asked questions about our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-3">Are there any monthly fees?</h3>
              <p className="text-slate-300">
                No, all our plans are one-time payments that give you lifetime access to the platform. There are no recurring fees or subscriptions.
              </p>
            </div>
            
            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-3">What channels can I connect to?</h3>
              <p className="text-slate-300">
                Our platform supports WhatsApp, SMS, Email, and Facebook Messenger integrations. The specific channels available depend on your chosen plan.
              </p>
            </div>
            
            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-3">Do I need my own OpenAI API key?</h3>
              <p className="text-slate-300">
                Yes, you'll need to provide your own OpenAI API key to power the AI features. This gives you full control over your usage and costs.
              </p>
            </div>
            
            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-3">What is the time delay feature?</h3>
              <p className="text-slate-300">
                Our time delay feature allows you to schedule automated messages with natural timing intervals, making conversations feel more authentic and preventing overwhelming your leads.
              </p>
            </div>
            
            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-3">How does Go High Level integration work?</h3>
              <p className="text-slate-300">
                Our platform connects to Go High Level via API, allowing seamless transfer of lead information, conversation history, and customer data between systems.
              </p>
            </div>
            
            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50">
              <h3 className="text-xl font-semibold mb-3">What support is included?</h3>
              <p className="text-slate-300">
                All plans include 24/7 support via email and chat. Our team is always available to help you with any questions or technical issues you may encounter.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-blue-600/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Choose your plan and start automating your customer communications today
          </p>
          <Button size="lg" className="text-lg py-6 px-8" asChild>
            <Link to="/register">
              Create Your Account
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

export default PricingPage;
