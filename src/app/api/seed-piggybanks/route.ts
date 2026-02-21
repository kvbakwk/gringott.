import { NextResponse } from 'next/server';
import pool from '../../utils/db';

export async function GET() {
  try {
    // 1. Ensure wallets exist (Idempotent)
    const walletsToSeed = [
      { name: 'Wakacje w Grecji', balance: 3240.00 },
      { name: 'MacBook Pro', balance: 9600.00 },
      { name: 'Fundusz Awaryjny', balance: 1010.00 },
      { name: 'Remont Mieszkania', balance: 0.00 }
    ];

    for (const w of walletsToSeed) {
      const existing = await pool.query('SELECT id FROM public.wallet WHERE name = $1 AND user_id = 1 AND wallet_type_id = 5', [w.name]);
      if (existing.rowCount === 0) {
        await pool.query('INSERT INTO public.wallet (name, balance, user_id, wallet_type_id) VALUES ($1, $2, 1, 5)', [w.name, w.balance]);
      }
    }

    // 2. Ensure transactions exist (Simple check by description and wallet)
    const piggybankData = [
      { name: 'Wakacje w Grecji', amount: 500.00, desc: 'Wpłata własna', daysAgo: 1 },
      { name: 'Wakacje w Grecji', amount: 2.45, desc: 'Końcówka z zakupów', daysAgo: 2 },
      { name: 'Wakacje w Grecji', amount: 1.20, desc: 'Końcówka z Uber', daysAgo: 3 },
      { name: 'MacBook Pro', amount: 2000.00, desc: 'Premia kwartalna', daysAgo: 1 },
      { name: 'MacBook Pro', amount: 0.89, desc: 'Zaokrąglenie płatności', daysAgo: 5 },
      { name: 'Fundusz Awaryjny', amount: 200.00, desc: 'Regularny przelew', daysAgo: 1 },
      { name: 'Fundusz Awaryjny', amount: 0.45, desc: 'Końcówka z Lidl', daysAgo: 2 },
    ];

    for (const item of piggybankData) {
      const walletRes = await pool.query('SELECT id FROM public.wallet WHERE name = $1 AND user_id = 1 AND wallet_type_id = 5', [item.name]);
      if (walletRes.rowCount > 0) {
        const walletId = walletRes.rows[0].id;
        const txExisting = await pool.query('SELECT id FROM public.transaction WHERE wallet_id = $1 AND description = $2 AND amount = $3', [walletId, item.desc, item.amount]);
        if (txExisting.rowCount === 0) {
          await pool.query(`
            INSERT INTO public.transaction (date, amount, description, category_id, subject_id, income, important, user_id, wallet_id, method_id, transaction_type_id)
            VALUES (NOW() - INTERVAL '${item.daysAgo} days', $1, $2, 1, 1, true, false, 1, $3, 1, 1)
          `, [item.amount, item.desc, walletId]);
        }
      }
    }

    return NextResponse.json({ message: 'Seeding successful and cleaned up' });
  } catch (error) {
    console.error('Seeding failed:', error);
    return NextResponse.json({ message: 'Seeding failed', error: String(error) }, { status: 500 });
  }
}
