import { sqids, db } from '$lib';
import { text } from '@sveltejs/kit';

export async function POST({ request }) {
  const data = await request.arrayBuffer();
  console.log(data);
  const { rows: [row] } = await db.execute({
    sql: 'INSERT INTO profiles (contents) VALUES (?) RETURNING id',
    args: [data]
  });
  const hash = sqids.encode([row.id as number]);
  return text(`https://observable.tas.sh/p/${hash}`);
}
