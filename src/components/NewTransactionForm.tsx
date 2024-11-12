"use client";

import { createTransaction } from "@app/api/transaction/create";

export default function NewTransactionForm({user_id}){
    const transactionSubmit = async (formData: FormData): Promise<void> => {
        const res = await createTransaction(
            formData.get("date").toString(),
            formData.get("amount").toString(),
            formData.get("description").toString(),
            formData.get("category").toString(),
            formData.get("receiver").toString(),
            user_id
        );
            
    }
    
    return (
        <>
            <form action={transactionSubmit}>
                <input type="date" name="date" id="date" placeholder="data" />
                <br />
                <input
                type="number"
                name="amount"
                id="amount"
                defaultValue="0"
                step="0.01"
                min="0"
                placeholder="kwota"
                />{'zł'}
                <br />
                <input type="text" name="description" id="description" placeholder="opis" />
                <br />
                <input type="text" name="category" id="category" placeholder="kategoria" />
                <br />
                <input type="text" name="receiver" id="receiver" placeholder="adresat" />
                <br />
                <input type="submit" value="dodaj transakcje" />
            </form>
            
        </>
    ); 
}