"use server";

import { redirect } from "next/navigation";

import { deleteSession } from "@app/utils/session";
import { RouteSegments } from "@app/utils/routes";

export async function logout(): Promise<void> {
  await deleteSession();
  redirect(`/${RouteSegments.Login}`);
}
