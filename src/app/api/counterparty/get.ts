"use server";

import { CounterpartyT } from "@app/utils/db-actions/counterparty";

import { getCounterpartyById, getCounterpartiesByUserId } from "@app/utils/db-actions/counterparty";

export async function getCounterparty(counterpartyId: number): Promise<CounterpartyT> {
  return await getCounterpartyById(counterpartyId);
}

export async function getCounterparties(userId: number): Promise<CounterpartyT[]> {
  return await getCounterpartiesByUserId(userId);
}
