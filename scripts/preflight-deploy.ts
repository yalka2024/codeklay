/* eslint-disable no-console */
import 'cross-fetch/polyfill';

async function main() {
  const required = ['NEXTAUTH_URL', 'NEXTAUTH_SECRET', 'DATABASE_URL'];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error('Missing env keys:', missing.join(', '));
    process.exit(1);
  }

  const res = await fetch('http://localhost:3000/api/final-integration?action=readiness');
  if (!res.ok) {
    console.error('Readiness check failed with status:', res.status);
    process.exit(1);
  }
  const payload = await res.json();
  console.log('Readiness:', JSON.stringify(payload, null, 2));
}

main().catch((e) => { console.error(e); process.exit(1); });