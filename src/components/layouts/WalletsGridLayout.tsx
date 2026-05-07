import { WalletT } from "@utils/db-actions/wallet";
import { parseMoney } from "@utils/parser";
import { CircularProgress } from "../material/Progress";
import { Icon } from "../material/Icon";

export default function WalletsGridLayout({
  title,
  subtitle,
  totalBalance,
  items,
  isReady,
  colorTheme = "primary",
  renderItem,
  onAdd,
  children,
}: {
  title: string;
  subtitle?: string;
  totalBalance: number;
  items: WalletT[];
  isReady: boolean;
  colorTheme?: "primary" | "secondary" | "tertiary" | "error";
  renderItem?: (wallet: WalletT) => React.ReactNode;
  onAdd?: () => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full h-full p-8 gap-10 overflow-y-auto bg-background relative">
      {/* Header Section */}
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-on-surface">{title}</h1>
                {subtitle && <p className="text-on-surface-variant text-sm opacity-70">{subtitle}</p>}
            </div>
            <div className="flex items-center gap-8">
                <div className="flex flex-col items-end">
                    <div className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-widest mb-1">Suma w skarbonkach</div>
                    <div className="text-3xl font-bold text-on-surface">
                        <Value amount={totalBalance} show={isReady} suffix="PLN" />
                    </div>
                </div>
                <button 
                    onClick={onAdd}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer bg-primary text-on-primary hover:opacity-90 transition-all shadow-sm border border-transparent self-end mb-1"
                >
                    <Icon className="text-xl">add</Icon>
                    <span className="text-sm font-bold">Nowa skarbonka</span>
                </button>
            </div>
        </div>
      </div>

      {/* Grid (now a list of bars) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {items.map((wallet) => (
             renderItem ? renderItem(wallet) : (
                <div key={wallet.id} className="p-6 bg-white rounded-3xl border border-outline-variant/30 shadow-sm hover:shadow-md transition-all">
                    <div className="text-sm font-medium text-on-surface-variant mb-2">{wallet.name}</div>
                    <div className="text-2xl font-bold text-on-surface">
                        <Value amount={wallet.balance} show={isReady} suffix="PLN" />
                    </div>
                </div>
             )
        ))}
         {items.length === 0 && isReady && (
            <div className="col-span-full text-center text-on-surface-variant py-12 opacity-50 bg-white/50 rounded-3xl border-2 border-dashed border-outline-variant/30">
                Brak elementów w tej kategorii.
            </div>
        )}
      </div>
      
      {children}
    </div>
  );
}

function Value({ amount, show, suffix = "" }: { amount: number, show: boolean, suffix?: string }) {
  return (
    <>
      {show ? (
        <>{parseMoney(amount)} {suffix}</>
      ) : (
        <div className="inline-block w-4 h-4">
           <CircularProgress className="small" indeterminate />
        </div>
      )}
    </>
  );
}
