
import { Button } from "./ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: 199,
      features: [
        "3 AI Bots",
        "Time Delay Feature",
        "OpenAI Integration",
        "24/7 Support",
        "SMS Integration",
        "Email Integration",
        "Lifetime Access"
      ],
      popular: false,
      buttonText: "Get Started"
    },
    {
      name: "Professional",
      price: 400,
      features: [
        "8 AI Bots",
        "Advanced Time Delay Settings",
        "OpenAI Integration",
        "24/7 Priority Support",
        "SMS, Email Integration",
        "WhatsApp Integration",
        "Facebook Integration",
        "Lifetime Access"
      ],
      popular: true,
      buttonText: "Get Started"
    },
    {
      name: "Enterprise",
      price: 800,
      features: [
        "Unlimited AI Bots",
        "Custom Time Delay Options",
        "OpenAI Advanced Integration",
        "24/7 VIP Support",
        "All Messaging Platforms",
        "Go High Level Integration",
        "White-label Solutions",
        "Lifetime Access"
      ],
      popular: false,
      buttonText: "Get Started"
    }
  ];

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Select the perfect plan for your business needs. All plans include lifetime access with no recurring fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`pricing-card flex flex-col h-full ${
                plan.popular ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="bg-blue-500 text-white text-sm font-medium py-1 px-3 rounded-full self-start mb-4">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-slate-400 ml-2">one-time payment</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className={`w-full ${
                  plan.popular 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : ""
                }`}
                size="lg"
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
