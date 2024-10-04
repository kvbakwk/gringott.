import { cookies } from "next/headers";

import { getUserByUuid } from "@app/utils/db-actions/user";

export default async function getUser() {
    return await getUserByUuid(cookies().get("device_id").value);
}
