import { Pool, QueryResult } from "pg";

export async function isUserHaveWalletByUserId(user_id: number, cash: boolean) {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      "SELECT id FROM public.wallet WHERE user_id = $1 AND cash = $2;",
      [user_id, cash]
    );
    await client.end();
    return res.rows.length > 0;
}

export async function getCashWalletByUserId(user_id: number) {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      "SELECT id, balance FROM public.wallet WHERE user_id = $1 AND cash = TRUE;",
      [user_id]
    );
    const res2: QueryResult = await client.query(
      "SELECT id, amount, description, date, important, wallet_id, category_id, income FROM public.transaction WHERE wallet_id = $1;",
      [res.rows[0].id]
    );
    await client.end();
    return { wallet: res.rows[0], transactions: res2.rows };
}

export async function getBankWalletsByUserId(user_id: number) {
    const client: Pool = new Pool();
    const res: QueryResult = await client.query(
      "SELECT id, name, balance FROM public.wallet WHERE user_id = $1 AND cash = FALSE;",
      [user_id]
    );
    await client.end();
    const res2 = await Promise.all(res.rows.map(async (wallet) => {
      const client: Pool = new Pool();
      const res: QueryResult = await client.query(
        "SELECT id, amount, description, date, important, wallet_id, category_id, income FROM public.transaction WHERE wallet_id = $1;",
        [wallet.id]
      );
      await client.end();
      return { wallet, transactions: res.rows };
    }))

    return res2;
}