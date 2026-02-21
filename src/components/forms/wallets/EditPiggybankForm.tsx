"use client";

import { useState, useRef, useEffect } from "react";
import { updateWalletAPI } from "@app/api/wallet/update";
import { validateWalletName } from "@app/utils/validator";
import { WalletT } from "@app/utils/db-actions/wallet";

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

export default function EditPiggybankForm({ 
  wallet,
  successOperation, 
  cancelOperation 
}: { 
  wallet: WalletT;
  successOperation: () => void;
  cancelOperation: () => void;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [nameErr, setNameErr] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedIcon, setSelectedIcon] = useState<string>(wallet.icon || "savings");
  const [name, setName] = useState<string>(wallet.name);

  // Reset form when wallet changes
  useEffect(() => {
    setName(wallet.name);
    setSelectedIcon(wallet.icon || "savings");
    setNameErr(false);
    setError(false);
  }, [wallet]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (validateWalletName(name)) {
      setPending(true);
      updateWalletAPI(wallet.id, name, selectedIcon)
        .then((res) => {
          if (res?.success) {
            successOperation();
          } else {
            setNameErr(res?.nameErr || false);
          }
        })
        .catch(() => setError(true))
        .finally(() => setPending(false));
    } else {
      setNameErr(true);
    }
  };

  return (
    <form
      ref={formRef}
      className="flex flex-col justify-center items-center gap-[30px] w-fit h-fit px-[90px] py-[60px] bg-surface border-1 border-primary rounded-2xl shadow-lg"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col gap-[25px] w-[320px]">
        <div className="flex justify-center items-center text-on-surface-variant font-bold uppercase text-xs tracking-widest mb-2">
            Edytuj skarbonkę
        </div>
        
        <TextFieldOutlined
          className="w-full"
          label="nazwa skarbonki"
          name="name"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
          error={nameErr}
          errorText="od 1 do 20 znaków"
        >
            <Icon slot="leading-icon">savings</Icon>
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
            {pending ? "zapisywanie..." : "zapisz zmiany"}
        </FilledButton>
      </div>
      
      {error && (
          <p className="text-error text-xs mt-2">Wystąpił nieoczekiwany błąd. Spróbuj ponownie.</p>
      )}
    </form>
  );
}
