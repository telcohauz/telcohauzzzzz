import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      if (displayName && existing[0].displayName !== displayName) {
        await db.update(users).set({ displayName }).where(eq(users.uid, uid));
      }
      return existing[0];
    }

    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || email.split('@')[0],
        role: 'Senior Digital Auditor',
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Database operation failed', { cause: error });
  }
}
