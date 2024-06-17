import { sqids, db } from '$lib';
import { text } from '@sveltejs/kit';

export async function POST({ request }) {
  const data = await request.arrayBuffer();
  const { rows: [row] } = await db.execute({
    sql: 'INSERT INTO profiles (contents) VALUES (?) RETURNING id',
    args: [data]
  });
  const hash = sqids.encode([row.id as number]);
  return text(`https://${request.headers.get('host')}/p/${hash}`);
}
