"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { createSubjectAPI } from "@app/api/subject/create";
import { validateSubjectAddress, validateSubjectAtm, validateSubjectName, validateSubjectNormal } from "@app/utils/validator";

import { TextFieldOutlined } from "../../material/TextField";
import { FilledButton, OutlinedButton } from "../../material/Button";
import { Icon } from "@components/material/Icon";
import { Checkbox } from "@components/material/Checkbox";

export default function NewSubjectForm({ userId }: { userId: number }) {
  const router = useRouter();

  const [success, setSuccess] = useState<boolean>(false);
  const [nameErr, setNameErr] = useState<boolean>(false);
  const [addressErr, setAddressErr] = useState<boolean>(false);
  const [normalErr, setNormalErr] = useState<boolean>(false);
  const [atmErr, setAtmErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name: string = formData.get("name")?.toString();
    const address: string = formData.get("name")?.toString();
    const normal: boolean = formData.get("normal")?.toString() == "on";
    const atm: boolean = formData.get("atm")?.toString() == "on";

    if (validateSubjectName(name) && validateSubjectAddress(address) && validateSubjectNormal(normal) && validateSubjectAtm(atm)) {
      createSubjectAPI(name, userId, address, normal, atm)
        .then((res) => {
          setSuccess(res.createSubject);
          setNameErr(res.nameErr);
          setAddressErr(res.addressErr);
          setNormalErr(res.normalErr);
          setAtmErr(res.atmErr);
          setError(false);
          if (res.createSubject) router.back();
        })
        .catch(() => setError(true));
    } else {
      setSuccess(false);
      setNameErr(!validateSubjectName(name));
      setError(false);
    }
  };

  return (
    <form
      className="flex flex-col justify-center items-center gap-[30px] w-[400px] h-fit py-[60px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[20px] w-full px-[20px]">
        <TextFieldOutlined
          className="w-full"
          label="nazwa podmiotu"
          name="name"
          error={nameErr}
          errorText="wpisz nazwę podmiotu"
        >
          <Icon className="fill" slot="leading-icon">
            person
          </Icon>
        </TextFieldOutlined>
        <TextFieldOutlined
          className="w-full"
          label="adres podmiotu"
          name="address"
          error={addressErr}
          errorText="wpisz adres podmiotu"
        >
          <Icon className="fill" slot="leading-icon">
            location_on
          </Icon>
        </TextFieldOutlined>
        <div className="flex justify-center items-center gap-[20px]">
          <label
            className="flex justify-center items-center text-[14px] text-outline tracking-wider"
            htmlFor="normal"
          >
            <Checkbox className="m-[15px]" name="normal" id="normal" checked />
            normalny
          </label>
          <label
            className="flex justify-center items-center text-[14px] text-outline tracking-wider"
            htmlFor="atm"
          >
            <Checkbox className="m-[15px]" name="atm" id="atm" />
            bankomat
          </label>
        </div>
      </div>
      <div className="flex justify-center items-center self-end gap-[25px] w-fit px-[10px] py-[10px]">
        <OutlinedButton type="button" onClick={() => router.back()}>
          anuluj
        </OutlinedButton>
        <FilledButton>dodaj podmiot</FilledButton>
      </div>
    </form>
  );
}
