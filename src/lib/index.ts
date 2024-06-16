import Sqids from "sqids";
import { createClient } from '@libsql/client';
import { DB_URL, DB_KEY } from '$env/static/private';

export const db = createClient({
  url: DB_URL,
  authToken: DB_KEY
});

export const sqids = new Sqids();