
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { CryptoAddressList } from "./crypto/CryptoAddressList";
import { DepositForm } from "./crypto/DepositForm";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";

const CRYPTO_ADDRESSES = [
  {
    currency: "BTC",
    address: "bc1ql2y75kpm8lp5yw2ny6qm5wdzmrmq5yxyvsknht",
    icon: "₿"
  },
  {
    currency: "ETH/USDT (ERC20)",
    address: "0xea1024aE4f1f0aa6709bec64eA2d0d30DfFfFE48",
    icon: "Ξ"
  },
  {
    currency: "SOL",
    address: "HiP98Dh4GqadE1SQeB9RDgrSrckCApzfcVQDpb2nE9nj",
    icon: "◎"
  },
  {
    currency: "LTC",
    address: "ltc1qh6cgtv3tmtjxmcf50z3yc8jux9dgnee4wumrue",
    icon: "Ł"
  },
  {
    currency: "USDT (TRC20)",
    address: "TFYnctUvXTFRVftMS5ifXLTp3UHxtrVd2v",
    icon: "₮"
  },
  {
    currency: "XMR",
    address: "47PuDe22i7SQCWTnn71P27FpRCytutetaeij4nXTLauSH1Wg8PGj8yW2dti6VBc2b3VeMwfasFtrdSN7btRDG7gQRzb3tBn",
    icon: "ɱ"
  }
];

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CryptoDeposit = ({ isOpen, onOpenChange }: Props) => {
  const { user } = useBrowserAuth();

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Deposit Crypto</DialogTitle>
          <DialogDescription className="text-sm">
            Send crypto to one of the addresses below, then click "I've sent the crypto" to initiate the deposit process.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <CryptoAddressList addresses={CRYPTO_ADDRESSES} />
          <DepositForm userId={user.id} onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
