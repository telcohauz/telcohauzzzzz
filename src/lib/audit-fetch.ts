import { auth } from './firebase.ts';

export async function auditFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error('Sila log masuk untuk membuka portal audit.');
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const response = await fetch(input, { ...init, headers });
  if (response.status === 401 || response.status === 403) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Akses tidak dibenarkan.');
  }
  return response;
}
