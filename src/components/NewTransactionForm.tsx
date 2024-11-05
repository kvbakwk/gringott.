"use client";

export default function NewTransactionForm(){
    const transactionSubmit = async (formData: FormData): Promise<void> => {
        console.log(formData.get("date").toString());
        console.log(formData.get("sum").toString());
        console.log(formData.get("description").toString());
        console.log(formData.get("category").toString());
        console.log(formData.get("receiver").toString());
    }
    return (
        <>
        <form action={transactionSubmit}>
            <input type="date" name="date" id="date" placeholder="data" />
            <br />
            <input
            type="sum"
            name="sum"
            id="sum"
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