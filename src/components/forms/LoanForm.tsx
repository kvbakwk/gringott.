"use client";

import { useState } from "react";
import { FilledButton, OutlinedButton } from "@components/material/Button";
import { TextFieldOutlined } from "@components/material/TextField";
import { SelectOutlined, SelectOption } from "@components/material/Select";
import { SubjectT } from "@app/utils/db-actions/subject";
import { Icon } from "@components/material/Icon";

import { LoanT } from "@app/utils/db-actions/loan";
import { validateTransactionAmount, validateTransactionDate, validateTransactionDescription, validateTransactionSubjectId } from "@app/utils/validator";


export default function LoanForm({
    onSubmit,
    onCancel,
    subjects,
    initialData,
    userId,
}: {
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    subjects: SubjectT[];
    initialData?: LoanT;
    userId: number;
}) {
    const [subjectId, setSubjectId] = useState<number | null>(initialData ? initialData.subject_id : null);
    const [name, setName] = useState<string>(initialData?.name || "");
    const [amount, setAmount] = useState<string>(initialData ? initialData.total_amount.toString() : "");
    const [isGiven, setIsGiven] = useState<string>(initialData ? (initialData.is_given ? "given" : "received") : "given");
    const [date, setDate] = useState<string>(
        initialData
            ? new Date(new Date(initialData.created_at).getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
            : new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)
    );
    const [loading, setLoading] = useState(false);

    const [subjectIdErr, setSubjectIdErr] = useState(false);
    const [amountErr, setAmountErr] = useState(false);
    const [dateErr, setDateErr] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const numAmount = parseFloat(amount);
        const d = new Date(date);

        const isSubjectValid = subjectId ? await validateTransactionSubjectId(subjectId, userId) : false;
        const isAmountValid = validateTransactionAmount(numAmount);
        const isDateValid = validateTransactionDate(d);

        setSubjectIdErr(!isSubjectValid);
        setAmountErr(!isAmountValid);
        setDateErr(!isDateValid);

        if (!isSubjectValid || !isAmountValid || !isDateValid) return;

        setLoading(true);
        try {
            await onSubmit({
                subject_id: subjectId,
                name,
                total_amount: numAmount,
                is_given: isGiven === "given",
                date: d,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`flex flex-col justify-center items-center gap-[25px] w-fit h-fit px-[90px] py-[60px] bg-surface border-1 ${initialData ? "border-yellow-500" : "border-green-700"} rounded-2xl shadow-lg`}
        >

            <div className="flex justify-center w-full">
                <SelectOutlined
                    label="rodzaj"
                    value={isGiven}
                    // @ts-ignore
                    onChange={(e) => setIsGiven((e.target as any).value)}
                >
                    <Icon slot="leading-icon">swap_vert</Icon>
                    <SelectOption value="given">
                        <div slot="headline">pożyczam komuś</div>
                    </SelectOption>
                    <SelectOption value="received">
                        <div slot="headline">pożyczam od kogoś</div>
                    </SelectOption>
                </SelectOutlined>
            </div>
            <div className="flex flex-row items-start gap-[30px]">
                <div className="flex flex-col justify-center items-center gap-[25px] w-[250px]">
                    <SelectOutlined
                        label="podmiot"
                        className="w-full"
                        value={subjectId?.toString() || ""}
                        // @ts-ignore
                        onChange={(e) => {
                            setSubjectId(parseInt((e.target as any).value));
                            setSubjectIdErr(false);
                        }}
                        error={subjectIdErr}
                        errorText="wybierz podmiot"
                    >
                        <Icon slot="leading-icon">group</Icon>
                        {subjects.map((s) => (
                            <SelectOption key={s.id} value={s.id.toString()}>
                                <div slot="headline">{s.name}</div>
                            </SelectOption>
                        ))}
                    </SelectOutlined>
                    <TextFieldOutlined
                        label="data"
                        className="w-[250px]"
                        type="datetime-local"
                        value={date}
                        // @ts-ignore
                        onChange={(e) => {
                            setDate((e.target as any).value);
                            setDateErr(false);
                        }}
                        error={dateErr}
                        errorText="wybierz datę"
                    >
                        <Icon slot="leading-icon">event</Icon>
                    </TextFieldOutlined>

                </div>

                <div className="flex flex-col justify-center items-center gap-[25px] w-[250px]">
                    <TextFieldOutlined
                        label="kwota"
                        className="w-full"
                        type="number"
                        value={amount}
                        // @ts-ignore
                        onChange={(e) => {
                            setAmount((e.target as any).value);
                            setAmountErr(false);
                        }}
                        suffixText="zł"
                        error={amountErr}
                        errorText="wpisz poprawną kwotę"
                    >
                        <Icon slot="leading-icon">toll</Icon>
                    </TextFieldOutlined>

                    <TextFieldOutlined
                        label="opis (opcjonalnie)"
                        className="w-full"
                        value={name}
                        // @ts-ignore
                        onChange={(e) => {
                            setName((e.target as any).value);
                        }}
                    >
                        <Icon slot="leading-icon">reorder</Icon>
                    </TextFieldOutlined>
                </div>
            </div>

            <div className="flex gap-[15px] justify-end w-full mt-[15px]">
                <OutlinedButton onClick={onCancel} type="button">
                    anuluj
                </OutlinedButton>
                <FilledButton type="submit" disabled={loading}>
                    zapisz
                </FilledButton>
            </div>
        </form>
    );
}
