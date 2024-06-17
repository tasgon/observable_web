import { sqids, db } from '$lib';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
  const [id] = sqids.decode(params.id);
  const { rows } = await db.execute({
    sql: 'SELECT contents FROM profiles WHERE id = ?',
    args: [id]
  });

  if (rows.length > 0) {
    return new Response(rows[0].contents as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip'
      },
      encodeBody: "manual"
    });
  }

  const req = await fetch(`https://observable-old.tas.sh/v1/get/${params.id}`);
  const data = await req.json();
  return json(data);
}
