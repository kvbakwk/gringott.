"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { validateTransactionCounterparty } from "@app/utils/validator";
import { TextFieldOutlined } from "../material/TextField";
import { FilledButton, OutlinedButton } from "../material/Button";
import { Icon } from "@components/material/Icon";
import { createCounterparty } from "@app/api/counterparty/create";
import { getCounterparty } from "@app/api/counterparty/get";
import { editCounterparty } from "@app/api/counterparty/edit";

export default function EditCounterpartyForm({ userId, counterpartyId }: { userId: number; counterpartyId: number }) {
  const router = useRouter();

  const [name, setName] = useState<string>("");

  const [success, setSuccess] = useState<boolean>(false);
  const [nameErr, setNameErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getCounterparty(counterpartyId).then((res) => {
      setName(res.name);
    });
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name: string = formData.get("name")?.toString();

    if (validateTransactionCounterparty(name)) {
      editCounterparty(counterpartyId, name, userId)
        .then((res) => {
          setSuccess(res.createCounterparty);
          setNameErr(res.nameErr);
          setError(false);
          if (res.createCounterparty) router.back();
        })
        .catch(() => setError(true));
    } else {
      setSuccess(false);
      setNameErr(!validateTransactionCounterparty(name));
      setError(false);
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[35px] w-[400px] h-fit py-[60px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center w-full px-[20px]">
        <TextFieldOutlined
          className="w-full"
          label="nazwa podmiotu"
          name="name"
          error={nameErr}
          errorText="wpisz nazwę podmiotu"
          value={name}
        >
          <Icon className="fill" slot="leading-icon">
            person
          </Icon>
        </TextFieldOutlined>
      </div>
      <div className="flex justify-center items-center self-end gap-[25px] w-fit px-[10px] py-[10px]">
        <OutlinedButton type="button" onClick={() => router.back()}>
          anuluj
        </OutlinedButton>
        <FilledButton>zapisz zmiany</FilledButton>
      </div>
    </form>
  );
}
