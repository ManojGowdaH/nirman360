# Google Play compliance checklist

This checklist is for the NIRMANH360 website pages that a Play Console submission usually needs. It is not a Play review, not a legal opinion, and not a statement that the app is approved or compliant.

Review it against the Data safety form and the released Android build before submission. The Flutter app is not in this repository, so several items can only be confirmed there.

Status values: **Done** means this website implements it. **Pending** means it is not done. **Verify** means a person must check it outside this repository.

## Public pages

| Item | Status | Notes |
| --- | --- | --- |
| Privacy Policy is a public page | Done | `/privacy-policy` does not require an account. |
| Privacy Policy is intended to be served over HTTPS | Done | Canonical host is `https://nirman360.in`. HTTPS is provided when the site is deployed on Vercel. Confirm the live URL before pasting it into Play Console. |
| Policy names the developer or business | Pending | The page shows the legal name only when `NEXT_PUBLIC_LEGAL_NAME` is set. It currently says the name is not published. |
| Policy gives a contact method | Pending | Email and phone render only when configured. Until then the page says they are not published and points at the contact form, which itself stores nothing until the inbox is connected. |
| Policy explains collection and sharing | Done | Written for the website and for app features that may exist. It does not claim a named payment provider is in production. |
| Policy says personal information is not sold | Done | Stated in the sharing section. |
| Policy matches the app Data safety form | Verify | Compare every declaration in Play Console with the released app. Do not copy this policy into Data safety if the app collects something else. |
| Account deletion page is public and does not require sign-in | Done | `/delete-account`. |
| Deletion page explains the process and the limits | Done | It says some records may be retained and that the form does not itself delete the account. |
| Deletion request has a real backend before it is described as functional | Pending | The form records a request only after Supabase or `LEADS_WEBHOOK_URL` is configured and tested. Recording is not deletion. The auth-user deletion workflow in `docs/BACKEND.md` is not implemented. |
| In-app deletion path for accounts created in the app | Pending | Required by Play policy when users can create accounts. The page says this control is not available unless `NEXT_PUBLIC_IN_APP_ACCOUNT_DELETION=true`. Set that flag only after the control ships. |
| Privacy Policy linked from the app and Play Console | Verify | Add the live HTTPS policy URL in the app and in Play Console. This website links the policy in the footer and on the forms. |

## Do not claim

- Do not tell Play Console the deletion workflow is complete until a test account has actually been deleted or anonymised.
- Do not mark Data safety answers from this document alone.
- Do not advertise a Play Store listing, rating or download count. The site shows Coming soon until `NEXT_PUBLIC_GOOGLE_PLAY_URL` is a real `play.google.com` URL.
- Do not treat this file as certification.

## Before submission

1. Publish the legal name, address and privacy email, then re-read the policy.
2. Have the policy and terms reviewed. See the legal section in `README.md`.
3. Connect and test the enquiry inbox.
4. Implement the deletion workflow in `docs/BACKEND.md` and test it against a disposable account.
5. Ship in-app deletion, then set the public flag.
6. Paste the final `https://nirman360.in/privacy-policy` and `https://nirman360.in/delete-account` URLs into Play Console and open both in a private window.
