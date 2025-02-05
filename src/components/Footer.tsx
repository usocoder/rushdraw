import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal Information</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Licensed and Regulated Gaming Operator</li>
              <li>Terms of Service</li>
              <li>Privacy Policy</li>
              <li>Responsible Gaming</li>
              <li>Age Restriction: 18+</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Probability Information</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>All case opening probabilities are transparently displayed and independently verified by licensed gaming authorities.</p>
              <p>Each item's drop rate is calculated using a provably fair system that is regularly audited.</p>
              <p>Historical drop rates and audit reports are publicly available.</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Payment and Withdrawals</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>We accept major cryptocurrencies for deposits and withdrawals.</p>
              <p>Daily Rewards.</p>
              <p>Secure payment processing and instant crypto withdrawals.</p>
              <p>KYC verification required for withdrawals over certain limits.</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-4">
            WARNING: Case opening involves an element of chance. Please play responsibly and be aware of your local gambling laws and regulations.
            Items obtained have real-world value and can be shipped to you or withdrawn as cryptocurrency following our verification process.
          </p>
          <p>
            © {new Date().getFullYear()} RushDrop. All rights reserved. Licensed Gaming Operator: Rushdraw.com.
            All transactions are processed in accordance with international gaming regulations and anti-money laundering policies.
          </p>
        </div>
      </div>
    </footer>
  );
};