"use client";

import { useState, useRef } from "react";
import { createWalletAPI } from "@services/wallet/create";
import {
  validateWalletBalance,
  validateWalletName,
} from "@utils/validator";

import { TextFieldOutlined } from "@components/material/TextField";
import { FilledButton, OutlinedButton } from "@components/material/Button";
import { Icon } from "@components/material/Icon";

const AVAILABLE_ICONS = [
  { icon: "savings", label: "Skarbonka" },
  { icon: "flight", label: "Podróż" },
  { icon: "directions_car", label: "Samochód" },
  { icon: "home", label: "Dom" },
  { icon: "laptop_mac", label: "Komputer" },
  { icon: "smartphone", label: "Telefon" },
  { icon: "pedal_bike", label: "Rower" },
  { icon: "card_giftcard", label: "Prezent" },
  { icon: "security", label: "Bezpieczeństwo" },
  { icon: "school", label: "Edukacja" },
  { icon: "medical_services", label: "Zdrowie" },
  { icon: "checkroom", label: "Ubrania" },
  { icon: "sports_esports", label: "Gry" },
  { icon: "music_note", label: "Muzyka" },
  { icon: "pets", label: "Zwierzęta" },
  { icon: "celebration", label: "Impreza" },
];

export default function NewPiggybankForm({ 
  userId, 
  successOperation, 
  cancelOperation 
}: { 
  userId: number;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [nameErr, setNameErr] = useState<boolean>(false);
  const [balanceErr, setBalanceErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<string>("savings");

  const resetForm = () => {
    formRef.current?.reset();
    setSelectedIcon("savings");
    setNameErr(false);
    setBalanceErr(false);
    setError(false);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const name: string = formData.get("name").toString();
    const balance: number = parseFloat(formData.get("balance").toString());

    if (validateWalletName(name) && validateWalletBalance(balance)) {
      setPending(true);
      // wallet_type_id = 5 for Piggybanks
      createWalletAPI(name, balance, userId, 5, selectedIcon)
        .then((res) => {
          if (res.createWallet) {
              resetForm();
              successOperation();
          } else {
              setNameErr(res.nameErr);
              setBalanceErr(res.balanceErr);
          }
        })
        .catch(() => setError(true))
        .finally(() => setPending(false));
    } else {
      setNameErr(!validateWalletName(name));
      setBalanceErr(!validateWalletBalance(balance));
    }
  };

  return (
    <form
      ref={formRef}
      className="flex flex-col justify-center items-center gap-[30px] w-fit h-fit px-[90px] py-[60px] bg-surface border-1 border-tertiary rounded-2xl shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-[25px] w-[320px]">
        <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest mb-2">
            Nowa skarbonka
        </div>
        
        <TextFieldOutlined
          className="w-full"
          label="nazwa skarbonki"
          name="name"
          error={nameErr}
          errorText="od 1 do 20 znaków"
        >
            <Icon slot="leading-icon">savings</Icon>
        </TextFieldOutlined>

        <TextFieldOutlined
          className="w-full"
          label="kwota na start"
          name="balance"
          step="0.01"
          min="0"
          error={balanceErr}
          errorText="niepoprawna kwota"
          type="number"
          suffixText="zł"
        >
            <Icon slot="leading-icon">toll</Icon>
        </TextFieldOutlined>

        {/* Icon Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs text-on-surface-variant font-medium uppercase tracking-wider">
            Ikona
          </label>
          <div className="grid grid-cols-8 gap-1.5 p-3 bg-surface-variant/20 rounded-xl border border-outline-variant/30">
            {AVAILABLE_ICONS.map(({ icon, label }) => (
              <button
                key={icon}
                type="button"
                onClick={() => setSelectedIcon(icon)}
                title={label}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                  selectedIcon === icon
                    ? "bg-primary text-on-primary shadow-sm scale-110"
                    : "text-on-surface-variant hover:bg-black/5"
                }`}
              >
                <Icon className="text-lg">{icon}</Icon>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-[10px] w-full">
        <OutlinedButton type="button" onClick={cancelOperation}>
          anuluj
        </OutlinedButton>
        <FilledButton disabled={pending}>
            {pending ? "dodawanie..." : "dodaj skarbonkę"}
        </FilledButton>
      </div>
      
      {error && (
          <p className="text-error text-xs mt-2">Wystąpił nieoczekiwany błąd. Spróbuj ponownie.</p>
      )}
    </form>
  );
}
