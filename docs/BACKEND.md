# Backend setup

The website can run with no backend. In that mode the forms validate input and then tell the visitor that nothing was submitted. Do not replace that message with a success state.

When you are ready to receive enquiries, configure one of the two inboxes below. Supabase is used when both are present.

## Option A — Supabase

1. Create or open the Supabase project used by the mobile app. You can also use a separate project for the website.
2. In the SQL editor, run [`supabase/schema.sql`](../supabase/schema.sql).
3. Confirm Row Level Security is enabled on `public.website_requests` and that there is no policy granting `anon` or `authenticated` access. The table is written only with the service role, which bypasses RLS.
4. In Vercel, set:
   - `SUPABASE_URL` to the project URL (`https://<ref>.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY` to the service-role secret
5. Do not put the service-role key in the Flutter app, in a `NEXT_PUBLIC_` variable, or in client code.
6. Redeploy and submit the contact form. A row with `kind = 'contact'` and `status = 'received'` should appear. The page may show a reference id. That id is the row id.

Payloads are the validated fields only. A hash of the visitor network address is stored in `ip_hash`. The raw address is not written to the table.

### Account deletion is not finished by this table

Inserting a `deletion` row records a request. It does not delete an auth user, a profile, listings, bookings or payment records.

Before anyone tells a user or Play Console that deletion works end to end, add a server-side workflow:

1. Verify the person controls the account. A one-time code to the registered mobile number, checked on the server, is an appropriate check. Do not delete from an unauthenticated form alone.
2. Run the deletion in a Supabase Edge Function or another private server, using the service role. The browser must not hold that key.
3. Delete or anonymise profile, listing and support records that are personal data.
4. Keep transaction, tax, fraud and security records where the law requires retention, with the personal identifiers removed or separated where that is lawful.
5. Delete the Supabase Auth user only after the related rows are handled, so foreign keys do not leave an unrecoverable half-state.
6. Mark the `website_requests` row `closed` without copying more personal data into logs than the reference id.
7. Return a clear failure to the caller if any required step fails. Do not report the account as deleted when it was not.
8. Reject a request that cannot be matched to an account, and do not reveal whether a mobile number is registered beyond what the verification step needs.
9. Rate-limit verification attempts.
10. Test with a disposable account: confirm the auth user is gone, personal rows are gone or anonymised, and a retained financial row no longer carries the person’s name or mobile number.

Until that workflow is deployed and tested, the website copy must keep saying that the request was recorded and the account was not deleted. The current code does only the recording step, and only when Supabase or the webhook is configured.

The Flutter app also needs its own in-app control that starts deletion, for accounts created in the app. Set `NEXT_PUBLIC_IN_APP_ACCOUNT_DELETION=true` only after that control is in the released app. This flag changes the public instructions. It does not delete anything.

## Option B — HTTPS webhook

Set `LEADS_WEBHOOK_URL` to a private HTTPS endpoint you control. Optionally set `LEADS_WEBHOOK_SECRET`. The site sends:

```json
{
  "id": "uuid",
  "kind": "contact",
  "payload": {},
  "ipHash": "hex",
  "receivedAt": "2026-11-12T00:00:00.000Z"
}
```

`kind` is `contact`, `partner` or `deletion`. The request succeeds only when the endpoint returns a 2xx response within 8 seconds. A deletion webhook has the same meaning as a Supabase row: the request was received, not completed.

The endpoint should authenticate the bearer secret, validate the body again, and avoid logging full mobile numbers in plain text.

## What the forms refuse

- Bank accounts, UPI PINs, passwords and identity documents. Those fields do not exist.
- Cross-origin browser posts.
- Bodies over 20 KB.
- More than 8 submissions per kind from one network address in 10 minutes. The limit lives in the server instance’s memory, so it is a basic guard, not a global firewall. Put a stricter limit on the webhook or Supabase function if you need one across many instances.

## Operations

Review `website_requests` on a schedule you can actually meet. Close rows when a person has replied or when a deletion workflow has finished. Do not leave deletion rows as if they were completed deletions.
