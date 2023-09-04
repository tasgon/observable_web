import { redirect } from '@sveltejs/kit';

export async function GET({ params }) {
  throw redirect(302, `https://observable.tas.sh/get/${params.id}`);
}
