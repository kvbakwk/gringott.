"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { SubjectT } from "@app/utils/db-actions/subject";
import { useData } from "@app/context/DataContext";
import { WalletT } from "@app/utils/db-actions/wallet";
import { parseDate, parseMoney } from "@app/utils/parser";
import { Icon } from "@components/material/Icon";
import { CircularProgress } from "@components/material/Progress";
import LoanForm from "@components/forms/LoanForm";
import RepaymentForm from "@components/forms/RepaymentForm";
import WalletsList from "@components/WalletsList";
import { FilledButton, OutlinedButton } from "@components/material/Button";
import { LoanT } from "@app/utils/db-actions/loan";

export default function LoansSummaryPage() {
    const { user, loans, transactions, subjects, wallets, loansReady, transactionsReady, walletsReady, subjectsReady, reloadLoans, reloadTransactions, reloadWallets } = useData();
    const formEl = useRef<HTMLDivElement>(null);
    const newLoanEl = useRef<HTMLDivElement>(null);
    const [operation, setOperation] = useState<string>("");
    const [selectedLoan, setSelectedLoan] = useState<LoanT | null>(null);
    const [focusEl, setFocusEl] = useState<HTMLElement | null>(null);

    const processedLoans = useMemo(() => {
        return loans.map(loan => {
            const loanTransactions = transactions.filter(t => Number(t.loan_id) === Number(loan.id));
            const paidAmount = loanTransactions.reduce((sum, t) => sum + t.amount, 0);
            const isPaid = paidAmount >= loan.total_amount || loan.status === 'paid';

            return {
                ...loan,
                computedPaidAmount: paidAmount,
                isPaid
            };
        }).sort((a, b) => {
            if (a.isPaid === b.isPaid) return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            return a.isPaid ? 1 : -1; // Active first
        });
    }, [loans, transactions]);

    const debts = useMemo(() => processedLoans.filter(l => !l.is_given), [processedLoans]);
    const claims = useMemo(() => processedLoans.filter(l => l.is_given), [processedLoans]);

    const totalDebts = useMemo(() => debts.filter(l => !l.isPaid).reduce((acc, curr) => acc + (curr.total_amount - curr.computedPaidAmount), 0), [debts]);
    const totalClaims = useMemo(() => claims.filter(l => !l.isPaid).reduce((acc, curr) => acc + (curr.total_amount - curr.computedPaidAmount), 0), [claims]);

    useEffect(() => {
        if (["new", "repay", "edit", "delete"].includes(operation)) {
            formEl.current?.classList.remove("hidden");
            formEl.current?.classList.add("flex");
            setTimeout(() => {
                formEl.current?.classList.remove("opacity-0");
            }, 1);
            if (focusEl) {
                focusEl.classList.add("transition-all", "shadow-sm");
                if (operation !== "new") {
                    focusEl.classList.add("bg-surface", "border-1");
                }
                
                if (operation === "new") focusEl.classList.add("border-primary", "ring-4", "ring-primary/20");
                else if (operation === "edit") focusEl.classList.add("border-yellow-500");
                else if (operation === "repay") focusEl.classList.add("border-blue-700");
                else focusEl.classList.add("border-error");
            }
        }
    }, [operation, focusEl]);

    const hideForm = () => {
        formEl.current?.classList.remove("flex");
        formEl.current?.classList.add("hidden");
        setTimeout(() => {
            formEl.current?.classList.add("opacity-0");
        }, 1);
        if (focusEl) {
            focusEl.classList.remove("shadow-sm", "bg-surface", "border-1", "border-primary", "ring-4", "ring-primary/20", "border-yellow-500", "border-blue-700", "border-error");
            setTimeout(() => {
                focusEl.classList.remove("transition-all");
            }, 10);
        }
    };

    const handleAddLoan = async (data: any) => {
        try {
            const res = await fetch("/api/loan/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, userId: user?.id })
            });
            if (!res.ok) throw new Error("Failed to add loan");
            successOperation();
        } catch (e) {
            console.error(e);
            alert("Błąd podczas dodawania pożyczki");
        }
    };

    const handleRepay = async (data: any) => {
        try {
            const res = await fetch("/api/loan/pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, userId: user?.id })
            });
            if (!res.ok) throw new Error("Failed to repay loan");
            successOperation();
        } catch (e) {
            console.error(e);
            alert("Błąd podczas spłaty pożyczki");
        }
    };

    const handleEditLoan = async (data: any) => {
        if (!selectedLoan) return;
        try {
            const res = await fetch("/api/loan/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loanId: selectedLoan.id, ...data })
            });
            if (!res.ok) throw new Error("Failed to edit loan");
            successOperation();
        } catch (e) {
            console.error(e);
            alert("Błąd podczas edycji pożyczki");
        }
    };

    const handleDeleteLoan = async () => {
        if (!selectedLoan) return;
        try {
            const res = await fetch("/api/loan/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loanId: selectedLoan.id })
            });
            if (!res.ok) throw new Error("Failed to delete loan");
            successOperation();
        } catch (e) {
            console.error(e);
            alert("Błąd podczas usuwania pożyczki");
        }
    };

    const successOperation = () => {
        hideForm();
        setOperation("");
        setSelectedLoan(null);
        setFocusEl(null);
        reloadLoans();
        reloadTransactions();
        reloadWallets();
    };

    const closeForm = () => {
        hideForm();
        setOperation("");
        setSelectedLoan(null);
        setFocusEl(null);
    }

    const isLoading = !loansReady || !transactionsReady || !walletsReady;

    if (!user) return null;

    return (
        <div className="flex flex-col w-full h-full p-8 gap-8 overflow-y-auto">
             {/* Header */}
            <div className="flex justify-between items-start w-full">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold text-on-surface">należności</h1>
                    <p className="text-on-surface-variant text-sm">zarządzaj swoimi długami i wierzytelnościami</p>
                </div>
                 <div className="flex items-center gap-4">

                    <div
                        ref={newLoanEl}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer bg-primary text-on-primary hover:bg-primary-hover transition-all shadow-sm border border-transparent"
                        onClick={() => {
                            setOperation("new");
                            setFocusEl(newLoanEl.current);
                        }}
                    >
                        <Icon className="text-xl">add</Icon>
                        <span className="text-sm font-bold">dodaj należność</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                
                {/* Debts Column */}
                <div className="flex flex-col gap-6 bg-surface rounded-3xl p-6">
                    <div className="flex justify-between items-baseline">
                        <div className="flex items-center gap-2 text-red-700">
                             <Icon>trending_down</Icon>
                             <span className="text-lg font-bold">moje długi</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                             <span className="text-sm text-on-surface-variant">łącznie:</span>
                             <span className="text-xl font-bold text-red-700">{parseMoney(totalDebts)} PLN</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                             <div className="flex justify-center py-8"><CircularProgress /></div>
                        ) : debts.length > 0 ? (
                            debts.map(loan => (
                                <LoanCard
                                    key={loan.id}
                                    loan={loan}
                                    subject={subjects.find(s => s.id === loan.subject_id)}
                                    transactions={transactions.filter(t => Number(t.loan_id) === Number(loan.id))}
                                    type="debt"
                                    onRepay={(el) => {
                                        setSelectedLoan(loan);
                                        setOperation("repay");
                                        setFocusEl(el);
                                    }}
                                    onEdit={(el) => {
                                        setSelectedLoan(loan);
                                        setOperation("edit");
                                        setFocusEl(el);
                                    }}
                                    onDelete={(el) => {
                                        setSelectedLoan(loan);
                                        setOperation("delete");
                                        setFocusEl(el);
                                    }}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-on-surface-variant opacity-60 italic">Brak długów</div>
                        )}
                    </div>
                </div>

                {/* Claims Column */}
                <div className="flex flex-col gap-6 bg-surface rounded-3xl p-6">
                    <div className="flex justify-between items-baseline">
                        <div className="flex items-center gap-2 text-green-700">
                             <Icon>trending_up</Icon>
                             <span className="text-lg font-bold">dłużnicy</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                             <span className="text-sm text-on-surface-variant">łącznie:</span>
                             <span className="text-xl font-bold text-green-700">{parseMoney(totalClaims)} PLN</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                             <div className="flex justify-center py-8"><CircularProgress /></div>
                        ) : claims.length > 0 ? (
                            claims.map(loan => (
                                <LoanCard
                                    key={loan.id}
                                    loan={loan}
                                    subject={subjects.find(s => s.id === loan.subject_id)}
                                    transactions={transactions.filter(t => Number(t.loan_id) === Number(loan.id))}
                                    type="claim"
                                     onRepay={(el) => {
                                        setSelectedLoan(loan);
                                        setOperation("repay");
                                        setFocusEl(el);
                                    }}
                                    onEdit={(el) => {
                                        setSelectedLoan(loan);
                                        setOperation("edit");
                                        setFocusEl(el);
                                    }}
                                    onDelete={(el) => {
                                        setSelectedLoan(loan);
                                        setOperation("delete");
                                        setFocusEl(el);
                                    }}
                                />
                            ))
                        ) : (
                            <div className="text-center py-8 text-on-surface-variant opacity-60 italic">Brak dłużników</div>
                        )}
                    </div>
                </div>

            </div>


            {/* Modals/Forms Overlay */}
             <div
                ref={formEl}
                className="fixed inset-0 hidden justify-center items-center bg-black/50 z-50 opacity-0 transition-opacity duration-200 backdrop-blur-sm">
                {operation === "new" && (
                    <LoanForm
                        subjects={subjects}
                        onSubmit={handleAddLoan}
                        onCancel={closeForm}
                        userId={user?.id}
                    />
                )}
                {operation === "edit" && selectedLoan && (
                    <LoanForm
                        subjects={subjects}
                        initialData={selectedLoan}
                        onSubmit={handleEditLoan}
                        onCancel={closeForm}
                        userId={user?.id}
                    />
                )}
                {operation === "repay" && selectedLoan && (
                    <RepaymentForm
                        loan={selectedLoan}
                        wallets={wallets}
                        onSubmit={handleRepay}
                        onCancel={closeForm}
                        userId={user?.id}
                    />
                )}
                {operation === "delete" && selectedLoan && (
                    <div className="flex justify-center items-center gap-[30px] w-[500px] h-fit py-[40px] bg-surface border-1 border-error rounded-2xl shadow-lg transition-all">
                        <div className="flex flex-col justify-center items-center gap-[50px] w-[400px] px-[10px] py-[10px]">
                            <div className="font-medium text-[18px]">
                                Czy na pewno chcesz usunąć tę należność?
                            </div>
                            <div className="flex justify-end items-center gap-[10px] w-full">
                                <OutlinedButton 
                                    onClick={closeForm}
                                >
                                    nie, anuluj
                                </OutlinedButton>
                                <FilledButton 
                                    className="error"
                                    onClick={handleDeleteLoan}
                                >
                                    tak, usuń
                                </FilledButton>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function LoanCard({ 
    loan, 
    subject, 
    transactions,
    type,
    onRepay, 
    onEdit, 
    onDelete 
}: { 
    loan: any, 
    subject: SubjectT | undefined,
    transactions: TransactionT[],
    type: 'debt' | 'claim',
    onRepay: (el: HTMLElement) => void, 
    onEdit: (el: HTMLElement) => void, 
    onDelete: (el: HTMLElement) => void 
}) {
    const cardEl = useRef<HTMLDivElement>(null);
    const isPaid = loan.isPaid;
    const isDebt = type === 'debt';
    
    const percentage = isPaid ? 100 : Math.min(100, Math.round((loan.computedPaidAmount / loan.total_amount) * 100));
    const remaining = loan.total_amount - loan.computedPaidAmount;
    
    // Sort transactions by date descending to find the last one
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastPaymentDate = sortedTransactions.length > 0 ? parseDate(new Date(sortedTransactions[0].date)) : (isPaid ? parseDate(new Date(loan.updated_at)) : "Brak");
    
    // Colors based on type
    const amountColor = isDebt ? "text-red-700" : "text-green-700";
    const initialsBg = isDebt ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
    const progressColor = isDebt ? "bg-red-600" : "bg-green-600";
    const progressTrack = isDebt ? "bg-red-100" : "bg-green-100";

    return (
        <div 
            ref={cardEl}
            className={`flex flex-col p-5 rounded-2xl border border-outline-variant/30 hover:shadow-lg transition-all relative group ${isPaid ? 'opacity-60 grayscale bg-surface-variant/30' : 'bg-white'}`}
        >
             {/* Top Row: Avatar & Name & Amount */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${initialsBg}`}>
                        {subject ? subject.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : "?"}
                    </div>
                    <div>
                        <div className="font-bold text-on-surface">{subject?.name || "Nieznany"}</div>
                        <div className="text-xs text-on-surface-variant flex flex-col">
                             <span className="font-medium text-sm text-on-surface">{loan.name}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-lg font-bold ${isPaid ? 'text-on-surface-variant' : amountColor}`}>
                        {isPaid ? "0,00 PLN" : `${parseMoney(remaining)} PLN`}
                    </div>
                    {isPaid ? (
                         <div className="text-xs text-on-surface-variant">Spłacono: {parseMoney(loan.total_amount)} PLN</div>
                    ) : (
                        <div className="text-xs text-on-surface-variant">z {parseMoney(loan.total_amount)} PLN</div>
                    )}
                </div>
            </div>

            {/* Middle Row: Progress */}
            <div className="flex flex-col gap-1 mb-4">
                 <div className="flex justify-between text-xs text-on-surface-variant/80">
                    <span>Postęp spłaty</span>
                    <span>{percentage}%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isPaid ? 'bg-surface-variant' : progressTrack}`}>
                    <div 
                        className={`h-full rounded-full transition-all duration-500 ${isPaid ? 'bg-on-surface-variant' : progressColor}`} 
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Bottom Row: Footer info & Actions */}
             <div className="flex justify-between items-center pt-3 border-t border-outline-variant/30 text-xs">
                <div className="text-on-surface-variant">
                    {isPaid ? (
                        <span>Zakończono: {lastPaymentDate}</span>
                    ) : (
                         <span>Ostatnia spłata: {lastPaymentDate}</span>
                    )}
                </div>
                
                <div className="flex gap-1">
                     {!isPaid && (
                        <div 
                            className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant/50 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                            onClick={(e) => { e.stopPropagation(); onRepay(cardEl.current!); }}
                            title="Dodaj spłatę"
                        >
                            <Icon className="text-xl">payments</Icon>
                        </div>
                    )}
                    <div 
                         className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant/50 rounded-lg transition-all cursor-pointer"
                         onClick={(e) => { e.stopPropagation(); onEdit(cardEl.current!); }}
                         title="Edytuj szczegóły"
                    >
                        <Icon className="text-xl">edit</Icon>
                    </div>
                    <div 
                         className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all cursor-pointer"
                         onClick={(e) => { e.stopPropagation(); onDelete(cardEl.current!); }}
                         title="Usuń"
                    >
                        <Icon className="text-xl">delete</Icon>
                    </div>
                </div>
            </div>
        </div>
    );
}
