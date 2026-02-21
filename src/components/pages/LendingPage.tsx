"use client";

import { LoanT } from "@app/utils/db-actions/loan";
import { SubjectT } from "@app/utils/db-actions/subject";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { WalletT } from "@app/utils/db-actions/wallet";
import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { CircularProgress } from "@components/material/Progress";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";
import WalletsList from "@components/WalletsList";
import LoanForm from "@components/forms/LoanForm";
import RepaymentForm from "@components/forms/RepaymentForm";
import { useEffect, useRef, useState } from "react";

export default function LendingPage({
    loans,
    transactions,
    subjects,
    wallets,
    loansReady,
    transactionsReady,
    walletsReady,
    reloadLoans,
    reloadTransactions,
    reloadWallets,
    userId,
}: {
    loans: LoanT[];
    transactions: TransactionT[];
    subjects: SubjectT[];
    wallets: WalletT[];
    loansReady: boolean;
    transactionsReady: boolean;
    walletsReady: boolean;
    reloadLoans: () => Promise<void>;
    reloadTransactions: () => Promise<void>;
    reloadWallets: () => Promise<void>;
    userId: number;
}) {
    const formEl = useRef<HTMLDivElement>(null);
    const newLoanEl = useRef<HTMLDivElement>(null);

    const [operation, setOperation] = useState<string>("");
    const [selectedLoan, setSelectedLoan] = useState<LoanT | null>(null);
    const [focusEl, setFocusEl] = useState<HTMLElement | null>(null);

    const successOperation = () => {
        hideForm();
        setOperation("");
        reloadLoans();
        reloadTransactions();
        reloadWallets();
    };

    const cancelOperation = () => {
        hideForm();
        setOperation("");
    };

    useEffect(() => {
        if (["new", "repay"].includes(operation)) {
            if (!formEl.current) return;
            formEl.current.classList.remove("hidden");
            formEl.current.classList.add("flex");
            setTimeout(() => {
                formEl.current?.classList.remove("opacity-0");
            }, 1);
            if (focusEl) {
                focusEl.classList.add("transition-all", "shadow-sm", "bg-surface", "border-1");
                focusEl.classList.remove("border-surface");
                operation === "new" ? focusEl.classList.add("border-green-700") : focusEl.classList.add("border-blue-700");
            }
        }
    }, [operation, focusEl]);

    const hideForm = () => {
        if (!formEl.current) return;
        formEl.current.classList.remove("flex");
        formEl.current.classList.add("hidden");
        setTimeout(() => {
            formEl.current?.classList.add("opacity-0");
        }, 1);
        if (focusEl) {
            if (operation === "new") {
                focusEl.classList.remove("shadow-sm", "border-green-700");
                focusEl.classList.add("border-surface");
            } else {
                focusEl.classList.remove("shadow-sm", "bg-surface", "border-1", "border-blue-700");
                focusEl.classList.add("border-surface");
            }
            setTimeout(() => {
                focusEl.classList.remove("transition-all");
            }, 10);
        }
    };

    const handleAddLoan = async (data: any) => {
        try {
            const res = await fetch("/api/loan/add", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
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
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error("Failed to repay loan");
            successOperation();
        } catch (e) {
            console.error(e);
            alert("Błąd podczas spłaty");
        }
    };

    const loanEvents = [
        ...loans.map(l => ({ ...l, eventType: 'LOAN', date: new Date(l.created_at) })),
        ...transactions.filter(t => t.loan_id !== null).map(t => ({ ...t, eventType: 'REPAYMENT' }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="relative grid grid-rows-[50px_1fr] w-full h-full">
            <div className="flex justify-between items-center w-full h-full px-[20px]">
                <div
                    ref={newLoanEl}
                    className="flex items-center gap-[18px] text-base text-primary w-[230px] h-[30px] p-[18px] rounded-2xl cursor-pointer bg-surface border-1 border-surface"
                    onClick={() => {
                        setOperation("new");
                        setFocusEl(newLoanEl.current);
                    }}>
                    <Icon slot="icon">add</Icon>
                    <div className="text-on-surface-variant">nowa pożyczka</div>
                </div>
                <WalletsList wallets={wallets} walletsReady={walletsReady} />
            </div>

            <div className="flex flex-col w-[calc(100%-50px)] h-full">
                <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
                    <div className="flex justify-center items-center w-[20px]"></div>
                    <div className="flex justify-center items-center w-[200px]">data</div>
                    <div className="flex justify-center items-center w-[160px]">kwota</div>
                    <div className="flex justify-center items-center w-[200px]">opis</div>
                    <div className="flex justify-center items-center w-[200px]">podmiot</div>
                    <div className="flex justify-center items-center w-[200px]">rodzaj</div>
                    <div className="flex justify-center items-center w-[120px]">status</div>
                    <div className="flex justify-center items-center w-[150px]">akcja</div>
                    <div className="flex justify-center items-center w-[100px]"></div>
                </div>

                <div className={`flex w-full h-[calc(100vh-106px)] px-[20px] pb-[106px] overflow-y-auto scroll-none ${loansReady && transactionsReady && walletsReady ? "flex-col" : "justify-center items-center"
                    }`}>
                    {loansReady && transactionsReady && walletsReady ? (
                        loanEvents.map((event: any, idx) => {
                            if (event.eventType === 'LOAN') {
                                return (
                                    <LoanRow
                                        key={`loan-${event.id}`}
                                        loan={event}
                                        subjects={subjects}
                                        onRepay={(el) => {
                                            setSelectedLoan(event);
                                            setOperation("repay");
                                            setFocusEl(el);
                                        }}
                                    />
                                );
                            } else {
                                return (
                                    <RepaymentRow
                                        key={`repayment-${event.id}`}
                                        repayment={event}
                                        subjects={subjects}
                                        wallets={wallets}
                                    />
                                );
                            }
                        })
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <CircularProgress indeterminate />
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={formEl}
                className="absolute hidden justify-center items-center w-full h-full opacity-0 transition-all">
                {operation === "new" ? (
                    <LoanForm
                        subjects={subjects}
                        onSubmit={handleAddLoan}
                        onCancel={cancelOperation}
                        userId={userId}
                    />
                ) : operation === "repay" && selectedLoan ? (
                    <RepaymentForm
                        loan={selectedLoan}
                        wallets={wallets}
                        onSubmit={handleRepay}
                        onCancel={cancelOperation}
                        userId={userId}
                    />
                ) : null}
            </div>
        </div>
    );
}

function LoanRow({ loan, subjects, onRepay }: { loan: LoanT, subjects: SubjectT[], onRepay: (el: HTMLElement) => void }) {
    const subject = subjects.find(s => s.id === loan.subject_id);
    const rowEl = useRef<HTMLDivElement>(null);
    const [hover, setHover] = useState(false);
    const percent = (Number(loan.paid_amount) / Number(loan.total_amount)) * 100;

    return (
        <div
            ref={rowEl}
            className={`flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] flex-shrink-0 rounded-lg hover:bg-surface hover:shadow-sm transition-colors`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="w-[20px] h-full flex items-center justify-center">
                <Icon className="text-primary text-[18px]">handshake</Icon>
            </div>
            <div className="flex justify-center items-center gap-[6px] w-[200px]">
                {parseDate(new Date(loan.created_at))}
                <div className="text-[15px]">{parseTime(new Date(loan.created_at))}</div>
            </div>
            <div className="flex justify-center items-center font-semibold text-xl w-[160px] text-primary">
                {parseMoney(Number(loan.total_amount))} zł
            </div>
            <div className="flex justify-center items-center truncate w-[200px]">
                {loan.name || "Pożyczka"}
            </div>
            <div className="flex justify-center items-center truncate w-[200px]">
                {subject?.name || "Nieznany"}
            </div>
            <div className="flex justify-center items-center w-[200px]">
                {loan.is_given ? "udzielona" : "zaciągnięta"}
            </div>
            <div className="flex flex-col justify-center items-center w-[120px] gap-1">
                <div className="text-[10px] leading-none opacity-70">{loan.status === 'paid' ? 'spłacona' : `${Math.round(percent)}%`}</div>
                <div className="w-[80px] bg-gray-700 h-[3px] rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all" style={{ width: `${percent}%` }}></div>
                </div>
            </div>
            <div className="flex justify-center items-center w-[150px]">
                {loan.status === 'active' ? 'aktywna' : 'spłacona'}
            </div>
            <div className={`flex justify-center items-center w-[100px] h-full transition-opacity ${hover && loan.status === 'active' ? "opacity-100" : "opacity-0"}`}>
                <IconButton className="mini" onClick={(e) => { e.stopPropagation(); onRepay(rowEl.current!); }}>
                    <Icon>payments</Icon>
                </IconButton>
            </div>
        </div>
    );
}

function RepaymentRow({ repayment, subjects, wallets }: { repayment: any, subjects: SubjectT[], wallets: WalletT[] }) {
    const subject = subjects.find(s => s.id === repayment.subject_id);
    const wallet = wallets.find(w => w.id === repayment.wallet_id);
    const [hover, setHover] = useState(false);

    return (
        <div
            className="flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] flex-shrink-0 rounded-lg hover:bg-surface hover:shadow-sm transition-colors"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="w-[20px] h-full flex items-center justify-center pl-2">
                <Icon className="text-[16px] transform rotate-90">subdirectory_arrow_right</Icon>
            </div>
            <div className="flex justify-center items-center gap-[6px] w-[200px]">
                {parseDate(new Date(repayment.date))}
                <div className="text-[15px]">{parseTime(new Date(repayment.date))}</div>
            </div>
            <div className="flex justify-center items-center font-semibold text-xl w-[160px] text-green-800">
                {parseMoney(repayment.amount)} zł
            </div>
            <div className="flex justify-center items-center truncate w-[200px] italic">
                {repayment.description || "spłata pożyczki"}
            </div>
            <div className="flex justify-center items-center truncate w-[200px]">
                {subject?.name}
            </div>
            <div className="flex justify-center items-center w-[200px]">
                spłata
            </div>
            <div className="flex justify-center items-center w-[120px]">
                {wallet?.name || "portfel"}
            </div>
            <div className="flex justify-center items-center w-[150px]">
                -
            </div>
            <div className="w-[100px]"></div>
        </div>
    );
}
