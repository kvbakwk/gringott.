"use client";

import { TransactionT } from "@app/utils/db-actions/transaction";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@app/context/DataContext";

import { parseMoney } from "@app/utils/parser";
import { generateTimeLimits } from "@app/utils/generator";
import { CircularProgress } from "@components/material/Progress";
import { Icon } from "@components/material/Icon";

export default function HomePage() {
  const router = useRouter();
  const { user, wallets, transactions, walletsReady, transactionsReady } = useData();

  const [cashBalance, setCashBalance] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [investmentsBalance, setInvestmentsBalance] = useState(0);
  const [savingsBalance, setSavingsBalance] = useState(0);
  const [piggybanksBalance, setPiggybanksBalance] = useState(0);
  const [goalsBalance, setGoalsBalance] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const [currentMonthIncome, setCurrentMonthIncome] = useState(0);
  const [lastMonthIncome, setLastMonthIncome] = useState(0);
  const [currentMonthExpense, setCurrentMonthExpense] = useState(0);
  const [lastMonthExpense, setLastMonthExpense] = useState(0);

  const [timeLimits] = useState(generateTimeLimits());

  useEffect(() => {
    if (walletsReady) {
      const cash = wallets
        .filter((wallet) => wallet.wallet_type_id === 1)
        .reduce((a, b) => a + b.balance, 0);
      const bank = wallets
        .filter((wallet) => wallet.wallet_type_id === 2)
        .reduce((a, b) => a + b.balance, 0);
      const savings = wallets
        .filter((wallet) => wallet.wallet_type_id === 3)
        .reduce((a, b) => a + b.balance, 0);
      const piggybanks = wallets
        .filter((wallet) => wallet.wallet_type_id === 5)
        .reduce((a, b) => a + b.balance, 0);
      const goals = wallets
        .filter((wallet) => wallet.wallet_type_id === 4)
        .reduce((a, b) => a + b.balance, 0);
      const investments = wallets
        .filter((wallet) => [7, 8, 9, 10, 11, 12, 13, 14].includes(wallet.wallet_type_id))
        .reduce((a, b) => a + b.balance, 0);
      
      setCashBalance(cash);
      setBankBalance(bank);
      setSavingsBalance(savings);
      setPiggybanksBalance(piggybanks);
      setGoalsBalance(goals);
      setInvestmentsBalance(investments);
      setTotalBalance(cash + bank);
    }
  }, [wallets, walletsReady]);

  useEffect(() => {
    if (transactionsReady) {
       // Income
        const curIncome = transactions
        .filter(
          (t) =>
            t.date >= timeLimits.month.startOfMonth &&
            t.date <= timeLimits.month.endOfMonth &&
            t.income
        )
        .reduce((a, b) => a + b.amount, 0);
      setCurrentMonthIncome(curIncome);

      const lastIncome = transactions
        .filter(
          (t) =>
            t.date >= timeLimits.previousMonth.startOfMonth &&
            t.date <= timeLimits.previousMonth.endOfMonth &&
            t.income
        )
        .reduce((a, b) => a + b.amount, 0);
      setLastMonthIncome(lastIncome);

      // Expense
      const curExpense = transactions
        .filter(
          (t) =>
            t.date >= timeLimits.month.startOfMonth &&
            t.date <= timeLimits.month.endOfMonth &&
            !t.income
        )
        .reduce((a, b) => a + b.amount, 0);
      setCurrentMonthExpense(curExpense);

      const lastExpense = transactions
        .filter(
          (t) =>
            t.date >= timeLimits.previousMonth.startOfMonth &&
            t.date <= timeLimits.previousMonth.endOfMonth &&
            !t.income
        )
        .reduce((a, b) => a + b.amount, 0);
    }
  }, [transactions, transactionsReady, timeLimits]);

  if (!user) return null;

  return (
    <div className="grid grid-rows-[1fr_auto] p-8 gap-8 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center w-full pl-6">
        <div>
          <div className="text-3xl font-bold text-on-surface">witaj, {user.name.split(" ")[0]}!</div>
          <p className="text-on-surface-variant text-sm mt-1">oto podsumowanie Twoich finansów na dziś</p>
        </div>
        <div className="text-right">
             <div className="text-sm text-on-surface-variant font-medium">całkowite saldo</div>
             <div className="text-4xl font-bold text-on-surface mt-1">
                <Value amount={totalBalance} show={walletsReady} suffix="zł" />
             </div>
        </div>
      </div>

      {/* Row 1: Core Assets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <BreakdownCard 
              title="gotówka" 
              amount={cashBalance} 
              show={walletsReady}
              icon="payments" 
              percent={5} 
              trend="up"
              textColor="text-cash"
              borderColor="hover:border-cash"
              onClick={() => router.push('/portfele/konta')}
          />
          <BreakdownCard 
              title="konta bankowe" 
              amount={bankBalance} 
              show={walletsReady}
              icon="account_balance"
              percent={2} 
              trend="down"
              textColor="text-bank"
              borderColor="hover:border-bank"
              onClick={() => router.push('/portfele/konta')}
          />
          <BreakdownCard 
              title="inwestycje" 
              amount={investmentsBalance} 
              show={walletsReady} 
              icon="trending_up"
              percent={12} 
              trend="up"
              textColor="text-investments"
              borderColor="hover:border-investments"
              onClick={() => router.push('/portfele/inwestycje')}
          />
      </div>

      {/* Row 2: Savings & Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <BreakdownCard 
              title="oszczędności" 
              amount={savingsBalance} 
              show={walletsReady}
              icon="nest_eco_leaf" 
              percent={3} 
              trend="up"
              textColor="text-savings"
              borderColor="hover:border-savings"
              onClick={() => router.push('/portfele/oszczednosci')}
          />
          <BreakdownCard 
              title="skarbonki" 
              amount={piggybanksBalance} 
              show={walletsReady}
              icon="savings"
              percent={8} 
              trend="up"
              textColor="text-piggybanks"
              borderColor="hover:border-piggybanks"
              onClick={() => router.push('/portfele/skarbonki')}
          />
          <BreakdownCard 
              title="cele" 
              amount={goalsBalance} 
              show={walletsReady} 
              icon="target"
              percent={15} 
              trend="up"
              textColor="text-goals"
              borderColor="hover:border-goals"
              onClick={() => router.push('/portfele/cele')}
          />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-6 w-full mb-4">
         <div className="flex flex-col gap-8">
            <SummaryCard 
                title="zarobiłeś" 
                amount={currentMonthIncome} 
                prevAmount={lastMonthIncome} 
                show={transactionsReady} 
                isIncome={true}
            />
            <SummaryCard 
                title="wydałeś" 
                amount={currentMonthExpense} 
                prevAmount={lastMonthExpense} 
                show={transactionsReady} 
                isIncome={false}
            />
         </div>
         <div className="bg-surface rounded-3xl p-6">
            <ExpenseAnalysisChart transactions={transactions} show={transactionsReady} />
         </div>
      </div>
    </div>
  );
}

function BreakdownCard({ title, amount, show, icon, percent, trend, textColor, borderColor, onClick }: { title: string, amount: number, show: boolean, icon: string, percent: number, trend: 'up' | 'down', textColor: string, borderColor: string, onClick: () => void }) {
    const isUp = trend === 'up';
    return (
        <div className={`p-6 bg-surface rounded-3xl flex justify-between gap-4 min-h-[140px] border-2 border-transparent ${borderColor} transition-[border-color] cursor-pointer`} onClick={onClick}>
            <div className="flex flex-col justify-between items-start">
                 <div className={`w-[36px] h-[36px] rounded-2xl bg-surface-variant flex items-center justify-start ${textColor}`}>
                    <Icon className="w-[36px] h-[36px] text-3xl">{icon}</Icon>
                 </div>
                 <div className="text-xl text-on-surface-variant font-medium pt-10">{title}</div>
            </div>
            <div className="flex flex-col justify-between items-end text-right">
                <div className={`text-3xl font-bold ${textColor}`}>
                    <Value amount={amount} show={show} suffix="zł" />
                </div>
                {amount > 0 && (
                    <div className={`flex items-center text-base font-bold gap-1 mt-4 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                        <Icon className="text-xl">{isUp ? 'trending_up' : 'trending_down'}</Icon>
                        <span>{isUp ? '+' : '-'}{percent}%</span>
                    </div>
                )}
            </div>
        </div>
    )
}

function SummaryCard({ title, amount, prevAmount, show, isIncome }: { title: string, amount: number, prevAmount: number, show: boolean, isIncome: boolean }) {
    const diff = amount - prevAmount;
    const isPositive = diff > 0;
    const absDiff = Math.abs(diff);
    
    // For income, positive is green (good). For expense, positive is red (bad).
    const isGood = isIncome ? isPositive : !isPositive;
    const colorClass = isGood ? 'text-green-600' : 'text-red-600';
    const bgClass = isGood ? 'bg-green-100/50' : 'bg-red-100/50';

    return (
        <div className="p-6 bg-surface rounded-3xl h-full flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isIncome ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    <Icon className="text-lg">{isIncome ? 'arrow_downward' : 'arrow_upward'}</Icon>
                </div>
                <div className="text-sm font-medium text-on-surface-variant">{title}</div>
             </div>
            <div className="text-3xl font-bold text-on-surface mb-3">
                <Value amount={amount} show={show} suffix="zł" />
            </div>
            <div className="flex items-center gap-2">
               {show && diff !== 0 ? (
                  <>
                    <div className={`flex items-center px-2 py-0.5 rounded-lg text-xs font-bold gap-1 ${bgClass} ${colorClass}`}>
                        <Icon className="text-sm">{isPositive ? 'trending_up' : 'trending_down'}</Icon>
                        <span>{isPositive ? '+' : '-'}{parseMoney(absDiff)} zł</span>
                    </div>
                    <span className="text-[11px] text-on-surface-variant font-medium">vs poprzedni miesiąc</span>
                  </>
               ) : show ? null : (
                   <div className="w-16 h-4 bg-surface-variant/20 animate-pulse rounded" />
               )}
            </div>
        </div>
    )
}

function ExpenseAnalysisChart({ transactions, show }: { transactions: TransactionT[], show: boolean }) {
    const data = useMemo(() => {
        if (!show) return [];
        
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push(d);
        }

        return months.map((monthStart, idx) => {
            const nextMonthStart = idx < months.length - 1 
                ? months[idx + 1] 
                : new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);
            
            const monthLabel = monthStart.toLocaleString('pl-PL', { month: 'short' });
            const formattedLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

            const amount = transactions
                .filter(t => 
                    !t.income && 
                    t.date >= monthStart && 
                    t.date < nextMonthStart
                )
                .reduce((a, b) => a + b.amount, 0);
            
            return {
                label: formattedLabel,
                amount: amount,
                isCurrent: monthStart.getMonth() === now.getMonth() && monthStart.getFullYear() === now.getFullYear()
            };
        });
    }, [transactions, show]);

    const maxAmount = Math.max(...data.map(d => d.amount), 1);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-on-surface text-lg">Analiza wydatków</h3>
                <div className="px-3 py-1 bg-surface-variant/50 rounded-lg text-xs font-medium text-on-surface-variant">
                    Ostatnie 6 miesięcy
                </div>
            </div>
            
            <div className="flex items-end justify-between flex-1 gap-2 min-h-[200px]">
                {data.map((item, index) => {
                    const heightPercent = (item.amount / maxAmount) * 100;
                    const height = item.amount > 0 ? Math.max(heightPercent, 5) : 0; 
                    
                    return (
                        <div key={index} className="flex flex-col items-center flex-1 gap-2 h-full justify-end group cursor-pointer">
                            <div className="w-full relative flex items-end justify-center h-full">
                                <div 
                                    className={`w-full max-w-[50px] rounded-t-lg transition-all duration-500 relative overflow-hidden ${item.isCurrent ? 'bg-outline-variant' : 'bg-surface-variant/30'}`}
                                    style={{ height: `${height}%` }}
                                >
                                     <div className={`absolute bottom-0 w-full h-full ${item.isCurrent ? 'bg-[#636c5b]' : 'bg-[#747c6a]'} opacity-90 group-hover:opacity-100 transition-opacity`} />
                                </div>
                                <div 
                                    className="absolute -top-8 text-xs font-bold text-on-surface bg-surface shadow-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none whitespace-nowrap"
                                >
                                    {parseMoney(item.amount)} zł
                                </div>
                            </div>
                            <div className={`text-xs font-medium ${item.isCurrent ? 'text-on-surface font-bold' : 'text-on-surface-variant'}`}>{item.label}</div>
                        </div>
                    )
                })}
            </div>
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
