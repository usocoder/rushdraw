
import { Button } from "@/components/ui/button";
import { Facebook, MessageCircle } from "lucide-react";

const ContactPage = () => {
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
        
        <div className="card p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <p className="mb-6">
            Have questions about our property development course? We're here to help!
            Contact us through any of the methods below and our team will get back to you as soon as possible.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <MessageCircle className="h-5 w-5 text-primary" />
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
      </div>
    </div>
  );
};

export default ContactPage;
