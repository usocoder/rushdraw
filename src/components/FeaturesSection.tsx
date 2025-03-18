
import { 
  MessageSquare, 
  Clock, 
  Bot, 
  MessageCircle, 
  Mail, 
  Phone, 
  Facebook, 
  Zap,
  BrainCircuit,
  Target
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Bot className="h-10 w-10 text-blue-500" />,
      title: "Customizable AI Bots",
      description: "Create and customize intelligent bots that automatically engage with your leads and customers."
    },
    {
      icon: <Clock className="h-10 w-10 text-purple-500" />,
      title: "Time Delay Settings",
      description: "Schedule messages with custom time delays to create natural conversation flows and follow-ups."
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-green-500" />,
      title: "OpenAI Integration",
      description: "Leverage the power of OpenAI's advanced language models to create conversational and helpful AI responses."
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-yellow-500" />,
      title: "WhatsApp Integration",
      description: "Connect your AI bots directly to WhatsApp to engage with leads and customers on their preferred platform."
    },
    {
      icon: <Mail className="h-10 w-10 text-red-500" />,
      title: "Email Automation",
      description: "Send personalized email sequences automatically based on customer interactions and behaviors."
    },
    {
      icon: <Phone className="h-10 w-10 text-blue-400" />,
      title: "SMS Integration",
      description: "Reach customers directly on their mobile devices with automated SMS messages and notifications."
    },
    {
      icon: <Facebook className="h-10 w-10 text-blue-600" />,
      title: "Facebook Messenger",
      description: "Integrate your AI bots with Facebook Messenger to capture and engage leads from social media."
    },
    {
      icon: <Zap className="h-10 w-10 text-orange-500" />,
      title: "Go High Level Integration",
      description: "Seamlessly connect with Go High Level to automate your marketing, sales, and CRM processes."
    },
    {
      icon: <Target className="h-10 w-10 text-pink-500" />,
      title: "Lead Closing Automation",
      description: "Convert leads into customers with intelligent follow-up sequences and personalized messaging."
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Our platform provides everything you need to automate and enhance your customer communication.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
