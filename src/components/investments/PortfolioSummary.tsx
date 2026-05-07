import { AssetT } from "@utils/db-actions/asset";
import { WalletT } from "@utils/db-actions/wallet";
import { parseMoney } from "@utils/parser";
import { Icon } from "@components/material/Icon";

export default function PortfolioSummary({
  assets,
  wallets,
  walletsReady,
  assetsReady,
}: {
  assets: AssetT[];
  wallets: WalletT[];
  walletsReady: boolean;
  assetsReady: boolean;
}) {
  // We can calculate total from wallets (Cash + Invested) or just investigate Assets.
  // Assuming 'wallets' here are the Investment Wallets, so their balance is the "Cash available to invest" + "Value of assets"? 
  // Actually, usually Investment Wallet Balance = Cash. Assets are separate. 
  // But in the user's legacy model, wallet balance WAS the asset value.
  // In the NEW model, wallet balance should probably be just CASH in that account.
  // And Assets are separate items.
  
  // So Total Portfolio Value = Sum(Wallet Balances [Cash]) + Sum(Asset Values [Invested])
  
  const totalCash = wallets.reduce((acc, curr) => acc + curr.balance, 0);
  
  const totalInvestedValue = assets.reduce((acc, curr) => acc + (curr.quantity * (curr.current_price || 0)), 0);
  const totalInvestedCost = assets.reduce((acc, curr) => acc + (curr.quantity * (curr.avg_buy_price || 0)), 0); // Cost basis for calculating profit on assets
  
  const totalPortfolioValue = totalCash + totalInvestedValue;

  // Profit/Loss is only relevant for Assets part usually, or we can look at global net worth change if we tracked it.
  // Let's focus on "Asset Profit/Loss"
  const profitLoss = totalInvestedValue - totalInvestedCost;
  const profitLossPercentage = totalInvestedCost > 0 ? (profitLoss / totalInvestedCost) * 100 : 0;

  const isLoss = profitLoss < 0;
  const statusColorClass = isLoss ? "text-red-600" : "text-green-600";
  const statusBgClass = isLoss ? "bg-red-500/10" : "bg-green-500/10";
  const statusIcon = isLoss ? "trending_down" : "trending_up";

  const isReady = walletsReady && assetsReady;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full mb-2">
      {/* Całkowita wartość */}
      <div className="bg-surface p-6 rounded-3xl flex flex-col justify-between">
         <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-on-surface-variant">całkowita wartość</span>
            <Icon className="text-on-surface-variant text-xl">savings</Icon>
         </div>
         <div className="text-2xl font-bold text-on-surface">
            {isReady ? `${parseMoney(totalPortfolioValue)} PLN` : "..."}
         </div>
         <div className="text-[10px] text-on-surface-variant opacity-60">
            gotówka: {parseMoney(totalCash)} / aktywa: {parseMoney(totalInvestedValue)}
         </div>
      </div>

      {/* Aktualna Wartość Aktywów */}
      <div className="bg-surface p-6 rounded-3xl flex flex-col justify-between">
         <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-on-surface-variant">wartość aktywów</span>
            <Icon className="text-on-surface-variant text-xl">currency_exchange</Icon>
         </div>
         <div className="text-2xl font-bold text-on-surface">
            {isReady ? `${parseMoney(totalInvestedValue)} PLN` : "..."}
         </div>
      </div>

       {/* Koszt inwestycji */}
       <div className="bg-surface p-6 rounded-3xl flex flex-col justify-between">
         <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-on-surface-variant">koszt inwestycji</span>
            <Icon className="text-on-surface-variant text-xl">account_balance_wallet</Icon>
         </div>
         <div className="text-2xl font-bold text-on-surface">
            {isReady ? `${parseMoney(totalInvestedCost)} PLN` : "..."}
         </div>
      </div>

       {/* Zysk / Strata */}
       <div className="bg-surface p-6 rounded-3xl flex flex-col justify-between">
         <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-medium text-on-surface-variant">zysk / strata</span>
            <Icon className={`${statusColorClass} text-xl`}>{statusIcon}</Icon>
         </div>
         <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${statusColorClass}`}>
                 {isReady ? `${profitLoss > 0 ? '+' : ''}${parseMoney(profitLoss)} PLN` : "..."}
            </span>
             {isReady && totalInvestedCost > 0 && (
                <span className={`${statusBgClass} ${statusColorClass} text-xs font-bold px-2 py-1 rounded-full`}>
                    {profitLoss > 0 ? '+' : ''}{profitLossPercentage.toFixed(2)}%
                </span>
             )}
         </div>
      </div>
    </div>
  );
}
