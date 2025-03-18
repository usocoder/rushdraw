
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Loader2, Send, MessageCircle } from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real implementation, you would send this data to a server
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond shortly.",
      });

      // Reset form
      setName("");
      setEmail("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/64224680772`, '_blank');
  };

  const openFacebook = () => {
    window.open(`https://facebook.com/devpropindustries`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <p className="mb-6">
              Have questions about our property development course? We're here to help!
              Fill out the form and our team will get back to you as soon as possible.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Send className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:devpropindustries@outlook.com" className="text-primary hover:underline">
                    devpropindustries@outlook.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <button 
                    onClick={openWhatsApp}
                    className="text-green-500 hover:underline"
                  >
                    +64 22 468 0772
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center mr-3">
                  <Facebook className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Facebook</p>
                  <button 
                    onClick={openFacebook}
                    className="text-blue-600 hover:underline"
                  >
                    Follow us on Facebook
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex space-x-4">
              <Button onClick={openWhatsApp} className="flex-1 bg-green-500 hover:bg-green-600">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
              
              <Button onClick={openFacebook} className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Facebook className="mr-2 h-4 w-4" />
                Facebook
              </Button>
            </div>
          </div>
          
          <div className="card p-6 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email address"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="How can we help you?"
                  rows={5}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
