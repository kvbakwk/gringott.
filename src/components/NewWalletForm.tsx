"use client";

export default function NewWalletForm() {

  const handleSubmit = async (formData: FormData): Promise<void> => {
    console.log("konto:", formData.get("name"), formData.get("balance"))
  }

  return (
    <form action={handleSubmit}>
      <input type="text" name="name" id="name" placeholder="nazwa" />
      <br />
      <input
        type="number"
        name="balance"
        id="balance"
        defaultValue="0"
        step="0.01"
        min="0"
        placeholder="stan konta"
      />{" "}
      zł
      <br />
      <input type="submit" value="dodaj konto" />
    </form>
  );
}
