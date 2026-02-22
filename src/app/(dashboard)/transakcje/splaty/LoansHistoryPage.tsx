"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { LoanT } from "@app/utils/db-actions/loan";
import { TransactionT } from "@app/utils/db-actions/transaction";
import { SubjectT } from "@app/utils/db-actions/subject";
import { WalletT } from "@app/utils/db-actions/wallet";
import { parseDate, parseMoney, parseTime } from "@app/utils/parser";
import { Icon } from "@components/material/Icon";
import { CircularProgress } from "@components/material/Progress";
import { IconButton } from "@components/material/IconButton";

// We reuse standard Transaction form if possible or create a specific one.
// Since we need Edit/Delete for both Loans and Transactions, we need to handle them.
// For now, let's setup the list view first.

import { CategoryT } from "@app/utils/db-actions/category";
import { SuperCategoryT } from "@app/utils/db-actions/super_category";
import { MethodT } from "@app/utils/db-actions/method";
import EditTransactionForm from "@components/forms/transactions/EditTransactionForm";
import WalletsList from "@components/WalletsList";
import { useData } from "@app/context/DataContext";

export default function LoansHistoryPage() {
    const { user, loans, transactions, subjects, wallets, methods, categories, superCategories, loansReady, transactionsReady, walletsReady, subjectsReady, methodsReady, categoriesReady, superCategoriesReady, reloadLoans, reloadTransactions } = useData();
    const formEl = useRef<HTMLDivElement>(null);
    const [operation, setOperation] = useState<string>("");
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [focusEl, setFocusEl] = useState<HTMLElement | null>(null);

    const historyEvents = useMemo(() => {
        const repaymentEvents = transactions
            .filter(t => t.loan_id !== null)
            .map(t => ({
                type: 'REPAYMENT',
                date: new Date(t.date),
                original: t,
                id: `repay-${t.id}`
            }));

        return repaymentEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
    }, [transactions]);

    const isLoading = !loansReady || !transactionsReady || !walletsReady;

    useEffect(() => {
        if (["edit", "delete"].includes(operation)) {
            formEl.current?.classList.remove("hidden");
            formEl.current?.classList.add("flex");
            setTimeout(() => {
                formEl.current?.classList.remove("opacity-0");
            }, 1);
            if (focusEl) {
                focusEl.classList.add("transition-all", "shadow-sm", "bg-surface", "border-1");
                focusEl.classList.remove("border-surface");
                if (operation === "edit") focusEl.classList.add("border-yellow-500");
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
            focusEl.classList.remove("shadow-sm", "bg-surface", "border-1", "border-yellow-500", "border-error");
            setTimeout(() => {
                focusEl.classList.remove("transition-all");
            }, 10);
        }
    };

    const successOperation = () => {
        hideForm();
        setOperation("");
        setSelectedEventId(null);
        setFocusEl(null);
        reloadLoans();
        reloadTransactions();
    };

    const cancelOperation = () => {
        hideForm();
        setOperation("");
        setSelectedEventId(null);
        setFocusEl(null);
    };

    const handleDelete = async (event: any) => {
        if (!confirm("Czy na pewno chcesz usunąć ten element?")) return;

        try {
            const res = await fetch(`/api/transaction/delete`, {
                method: 'POST',
                body: JSON.stringify({ transactionId: event.original.id }),
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error("Failed to delete transaction");
            successOperation();
        } catch (e) {
            console.error(e);
            alert("Błąd usuwania");
        }
    };

    const getSelectedEvent = () => historyEvents.find(e => e.id === selectedEventId);

    if (!user) return null;

    return (
        <div className="relative grid grid-rows-[50px_1fr] w-full h-full">
            <div className="flex justify-between items-center w-full h-full px-[20px]">
                <div className="flex items-center gap-[18px] text-base text-primary w-[230px] h-[30px] p-[18px]">
                    {/* Placeholder or just empty if we don't have a button */}
                </div>
                <WalletsList wallets={wallets} walletsReady={walletsReady} />
            </div>

            <div className="flex flex-col w-full h-full">
                <div className="flex justify-center items-end gap-[20px] font-bold text-primary text-md w-full h-[50px] pb-[10px]">
                    <div className="flex justify-center items-center w-[20px]"></div>
                    <div className="flex justify-center items-center w-[200px]">data</div>
                    <div className="flex justify-center items-center w-[160px]">kwota</div>
                    <div className="flex justify-center items-center w-[200px]">opis</div>
                    <div className="flex justify-center items-center w-[200px]">podmiot</div>
                    <div className="flex justify-center items-center w-[200px]">typ</div>
                    <div className="flex justify-center items-center w-[120px]">portfel</div>
                    <div className="flex justify-center items-center w-[150px]">metoda</div>
                    <div className="flex justify-center items-center w-[100px]"></div>
                </div>

                <div className={`flex w-full h-[calc(100vh-106px)] px-[20px] pb-[106px] overflow-y-auto scroll-none ${!isLoading ? "flex-col" : "justify-center items-center"}`}>
                    {isLoading ? (
                        <CircularProgress indeterminate />
                    ) : (
                        historyEvents.map((event) => (
                            <HistoryRow
                                key={event.id}
                                event={event}
                                subjects={subjects}
                                wallets={wallets}
                                onDelete={(el) => {
                                    setFocusEl(el);
                                    handleDelete(event);
                                }}
                                onEdit={(el) => {
                                    setOperation("edit");
                                    setSelectedEventId(event.id);
                                    setFocusEl(el);
                                }}
                            />
                        ))
                    )}
                </div>
            </div>

            <div
                ref={formEl}
                className="absolute hidden justify-center items-center w-full h-full opacity-0 transition-all">
                {operation === "edit" && (() => {
                    const event = getSelectedEvent();
                    if (!event) return <></>;
                    return (
                        <EditTransactionForm
                            userId={user?.id}
                            wallets={wallets}
                            transaction={event.original as TransactionT}
                            methods={methods}
                            subjects={subjects}
                            categories={categories}
                            superCategories={superCategories}
                            successOperation={successOperation}
                            cancelOperation={cancelOperation}
                        />
                    );
                })()}
            </div>
        </div>
    );
}

function HistoryRow({ event, subjects, wallets, onDelete, onEdit }: { event: any, subjects: SubjectT[], wallets: WalletT[], onDelete: (el: HTMLElement) => void, onEdit: (el: HTMLElement) => void }) {
    const isLoan = event.type === 'LOAN';
    const data = event.original;
    const subject = subjects.find(s => s.id === (isLoan ? data.subject_id : data.subject_id));
    const [hover, setHover] = useState(false);
    const rowEl = useRef<HTMLDivElement>(null);

    // Determine values for columns
    const amount = isLoan ? data.total_amount : data.amount;
    const description = isLoan ? (data.name || "pożyczka") : (data.description || "spłata");
    const typeLabel = isLoan ? (data.is_given ? "udzielenie" : "zaciągnięcie") : "spłata";
    // For loans, wallet/method are not directly applicable in the same way, or we could show "-"
    const walletName = !isLoan ? (wallets.find(w => w.id === data.wallet_id)?.name ?? "gotówka") : "-";
    const methodName = !isLoan ? data.method?.name : "-"; // Transaction data should have method joined? Or we need to look it up if not joined.
    // Note: TransactionT usually has method object if fetched via basic query with joins.
    // If 'data.method' exists (it does in TransactionT), use it.

    return (
        <div
            ref={rowEl}
            className="flex justify-center items-center gap-[20px] font-normal text-on-surface-variant text-base w-full h-[30px] rounded-lg hover:bg-surface"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <div className="w-[20px] h-full flex items-center justify-center">
                <Icon className={isLoan ? "text-primary text-[20px]" : "text-green-600 text-[20px]"}>
                    {isLoan ? "handshake" : "payments"}
                </Icon>
            </div>
            <div className="flex justify-center items-center gap-[6px] w-[200px]">
                {parseDate(event.date)}
                <div className="text-[15px]">{parseTime(event.date)}</div>
            </div>
            <div className={`flex justify-center items-center font-semibold text-xl w-[160px] ${isLoan ? 'text-primary' : 'text-green-800'}`}>
                {parseMoney(amount)} zł
            </div>
            <div className="flex justify-center items-center truncate w-[200px]">
                {description}
            </div>
            <div className="flex justify-center items-center truncate w-[200px]">
                {subject?.name}
            </div>
            <div className="flex justify-center items-center truncate w-[200px]">
                {typeLabel}
            </div>
            <div className="flex justify-center items-center truncate w-[120px]">
                {walletName}
            </div>
            <div className="flex justify-center items-center w-[150px]">
                {/* Method name might need check if data.method is fully populated or just ID depending on query. 
                    Assumed populated as per TransactionT */}
                {!isLoan && data.method ? data.method.name : methodName}
            </div>

            <div className={`flex justify-center items-center w-[100px] h-full transition-opacity ${hover ? "opacity-100" : "opacity-0"}`}>
                <IconButton className="mini" onClick={() => onEdit(rowEl.current!)}>
                    <Icon>edit</Icon>
                </IconButton>
                <IconButton className="mini error" onClick={() => onDelete(rowEl.current!)}>
                    <Icon>delete</Icon>
                </IconButton>
            </div>
        </div>
    );
}
