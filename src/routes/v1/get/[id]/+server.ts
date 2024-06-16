import { sqids, db } from '$lib';

export async function GET({ params }) {
  const [id] = sqids.decode(params.id);
  const query = await db.execute({
    sql: 'SELECT contents FROM profiles WHERE id = ?',
    args: [id]
  });
  
  return new Response(query.rows[0].contents as ArrayBuffer, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip'
    }
  });
}
