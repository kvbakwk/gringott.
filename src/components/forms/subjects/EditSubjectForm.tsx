"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  validateSubjectAddress,
  validateSubjectAtm,
  validateSubjectName,
  validateSubjectNormal,
} from "@app/utils/validator";
import { TextFieldOutlined } from "../../material/TextField";
import { FilledButton, OutlinedButton } from "../../material/Button";
import { Icon } from "@components/material/Icon";
import { getSubject } from "@app/api/subject/get";
import { Checkbox } from "@components/material/Checkbox";
import Loading from "@components/Loading";
import { editSubjectAPI } from "@app/api/subject/edit";

export default function EditSubjectForm({
  userId,
  subjectId,
}: {
  userId: number;
  subjectId: number;
}) {
  const router = useRouter();

  const [subjectReady, setSubjectReady] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [normal, setNormal] = useState<boolean>(true);
  const [atm, setAtm] = useState<boolean>(false);

  const [success, setSuccess] = useState<boolean>(false);
  const [nameErr, setNameErr] = useState<boolean>(false);
  const [addressErr, setAddressErr] = useState<boolean>(false);
  const [normalErr, setNormalErr] = useState<boolean>(false);
  const [atmErr, setAtmErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    getSubject(subjectId)
      .then((res) => {
        setName(res.name);
        setAddress(res.address);
        setNormal(res.normal);
        setAtm(res.atm);
      })
      .catch((err) => setError(true))
      .finally(() => setSubjectReady(true));
  }, []);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name: string = formData.get("name")?.toString();
    const address: string = formData.get("address")?.toString();
    const normal: boolean = formData.get("normal")?.toString() == "on";
    const atm: boolean = formData.get("atm")?.toString() == "on";

    if (
      validateSubjectName(name) &&
      validateSubjectAddress(address) &&
      validateSubjectNormal(normal) &&
      validateSubjectAtm(atm)
    ) {
      editSubjectAPI(subjectId, name, address, normal, atm)
        .then((res) => {
          setSuccess(res.editSubject);
          setNameErr(res.nameErr);
          setAddressErr(res.addressErr);
          setNormalErr(res.normalErr);
          setAtmErr(res.atmErr);
          setError(false);
          if (res.editSubject) router.back();
        })
        .catch(() => setError(true));
    } else {
      setSuccess(false);
      setNameErr(!validateSubjectName(name));
      setAddressErr(!validateSubjectAddress(address));
      setNameErr(!validateSubjectNormal(normal));
      setNameErr(!validateSubjectAtm(atm));
      setError(false);
    }
  };

  if (subjectReady)
  return (
    <form
      className="flex flex-col justify-center items-center gap-[35px] w-[400px] h-fit py-[60px]"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col justify-center items-center gap-[20px] w-full px-[20px]">
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
        <TextFieldOutlined
          className="w-full"
          label="adres podmiotu"
          name="address"
          error={addressErr}
          errorText="wpisz adres podmiotu"
          value={address ? address : ""}
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
            <Checkbox
              className="m-[15px]"
              name="normal"
              id="normal"
              checked={normal}
            />
            normalny
          </label>
          <label
            className="flex justify-center items-center text-[14px] text-outline tracking-wider"
            htmlFor="atm"
          >
            <Checkbox className="m-[15px]" name="atm" id="atm" checked={atm} />
            bankomat
          </label>
        </div>
      </div>
      <div className="flex justify-center items-center self-end gap-[25px] w-fit px-[10px] py-[10px]">
        <OutlinedButton type="button" onClick={() => router.back()}>
          anuluj
        </OutlinedButton>
        <FilledButton>zapisz zmiany</FilledButton>
      </div>
    </form>
  );
  else return <Loading />;
}
