import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Responsible Gaming</li>
              <li>Age Restriction: 18+</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Probability Information</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>All case opening probabilities are transparently displayed and independently verified.</p>
              <p>Each item's drop rate is calculated using a provably fair system.</p>
              <p>Historical drop rates are publicly available.</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Fair Play Guarantee</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>Our random number generation (RNG) system is certified and regularly audited.</p>
              <p>All outcomes are determined at the moment of opening.</p>
              <p>Each case's expected value is clearly displayed.</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-4">
            WARNING: Case opening involves an element of chance. Please play responsibly and be aware of your local gambling laws and regulations.
            Virtual items obtained have no real-world monetary value and cannot be exchanged for real money.
          </p>
          <p>
            © {new Date().getFullYear()} RushDrop. All rights reserved. RushDrop is not affiliated with any of the creators mentioned.
            Creator cases are created in partnership with respective content creators.
          </p>
        </div>
      </div>
    </footer>
  );
};