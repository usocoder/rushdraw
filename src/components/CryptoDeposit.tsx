import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { CryptoAddressList } from "./crypto/CryptoAddressList";
import { DepositForm } from "./crypto/DepositForm";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";

const CRYPTO_ADDRESSES = [
  {
    currency: "BTC",
    address: "bc1qhl5rsa5yhpqhh8du47579k2fd96erj2htyjn25",
    icon: "₿"
  },
  {
    currency: "ETH/USDT",
    address: "0xe5052AE7cA12bd144362cB33ca6BB7a0C2c5Cf4F",
    icon: "Ξ"
  },
  {
    currency: "SOL",
    address: "AswWDkR1mXoC1ZhYaJx8yQvv6f8hfz2ZJD6fyJ81Mmxb",
    icon: "◎"
  },
  {
    currency: "LTC",
    address: "ltc1q3efa77t36fhvln7kv0cukxdwum582k9atkm0ur",
    icon: "Ł"
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
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
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