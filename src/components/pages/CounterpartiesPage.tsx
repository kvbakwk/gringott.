"use client";

import { CounterpartyT } from "@app/utils/db-actions/counterparty";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getCounterparties } from "@app/api/counterparty/get";
import { Fab } from "@components/material/Fab";
import { Icon } from "@components/material/Icon";
import { IconButton } from "@components/material/IconButton";

export default function CounterpartiesPage({ userId }: { userId: number }) {
  const router = useRouter();

  const [counterparties, setCounterparties] = useState<CounterpartyT[]>([]);
  const [counterpartiesReady, setCounterpartiesReady] =
    useState<boolean>(false);

  useEffect(() => {
    getCounterparties(userId)
      .then((counterparties) => setCounterparties(counterparties))
      .finally(() => setCounterpartiesReady(true));
  }, []);

  return (
    <div className="self-start flex flex-wrap justify-start items-start gap-[36px] w-full px-[113px] py-[30px] ">
      {counterpartiesReady &&
        counterparties.map((counterparty) => (
          <Counterparty key={counterparty.id} counterparty={counterparty} />
        ))}
      <div className="absolute bottom-10 right-10">
        <Fab lowered onClick={() => router.push("/transakcje/podmioty/nowy")}>
          <Icon slot="icon">add</Icon>
        </Fab>
      </div>
    </div>
  );
}

export function Counterparty({
  counterparty,
}: {
  counterparty: CounterpartyT;
}) {
  const router = useRouter();

  const [hover, setHover] = useState(false);

  return (
    <div
      className="flex justify-between items-center w-[250px] h-[30px]"
      key={counterparty.id}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Icon className="text-primary fill">person</Icon>
      <div className="flex justify-start items-center text-primary font-semibold text-[16px] w-[150px] pl-[10px]">
        {counterparty.name}
      </div>
      <div
        className={`flex justify-between items-center w-[70px] h-full transition-opacity ${
          hover ? "opacity-100" : "opacity-0"
        }`}
      >
        <IconButton
          className="mini"
          onClick={() =>
            router.push(`/transakcje/podmioty/edycja/${counterparty.id}`)
          }
        >
          <Icon>edit</Icon>
        </IconButton>
        <IconButton
          className="mini error"
          onClick={() =>
            router.push(`/transakcje/podmioty/usuwanie/${counterparty.id}`)
          }
        >
          <Icon>delete</Icon>
        </IconButton>
      </div>
    </div>
  );
}
