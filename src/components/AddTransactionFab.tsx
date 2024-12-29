"use client";

import { useRouter } from "next/navigation";

import { Fab } from "./material/Fab";
import { Icon } from "./material/Icon";

export default function AddTransactionFab() {
  const router = useRouter();

  return (
    <Fab lowered onClick={() => router.push("/nowa-transakcja")}>
      <Icon slot="icon">add</Icon>
    </Fab>
  );
}
