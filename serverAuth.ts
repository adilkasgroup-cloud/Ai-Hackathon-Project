/**
 * Server-side authentication for Crop Doctor.
 *
 * The browser sends its Firebase ID token as `Authorization: Bearer <token>`.
 * We never trust a role, name or phone number sent by the browser:
 *   1. The token is verified with Firebase (Identity Toolkit `accounts:lookup`).
 *   2. The user's profile and role are read from Firestore (users/{uid}) using that
 *      same token, so your firestore.rules apply to the read too.
 *
 * No firebase-admin dependency is needed. For heavy production traffic you may prefer
 * firebase-admin's verifyIdToken (checks signatures locally, no network call).
 */
import type { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const firebaseConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, 'firebase-applet-config.json'), 'utf8')
);

export type Role = 'farmer' | 'extension_officer' | 'admin';

export interface AuthedUser {
  uid: string;
  email: string;
  name: string; // from the Firestore profile, falls back to Google name
  phone: string;
  district: string;
  epa: string;
  role: Role;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthedUser;
  }
}

const CACHE_MS = 60_000;
const cache = new Map<string, { user: AuthedUser; expires: number }>();

function readString(fields: any, key: string): string {
  return fields?.[key]?.stringValue ?? '';
}

async function loadUser(idToken: string): Promise<AuthedUser | null> {
  const hit = cache.get(idToken);
  if (hit && hit.expires > Date.now()) return hit.user;

  // 1. Verify the token with Firebase Auth
  const lookup = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    }
  );
  if (!lookup.ok) return null;
  const lookupJson: any = await lookup.json();
  const account = lookupJson.users?.[0];
  if (!account?.localId) return null;

  // 2. Read the user's profile (and role) from Firestore with their own token
  const docUrl =
    `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}` +
    `/databases/${firebaseConfig.firestoreDatabaseId || '(default)'}` +
    `/documents/users/${account.localId}`;
  const profileRes = await fetch(docUrl, { headers: { Authorization: `Bearer ${idToken}` } });
  if (!profileRes.ok) return null; // no profile yet => not a registered user

  const profileJson: any = await profileRes.json();
  const f = profileJson.fields || {};
  const role = readString(f, 'role');
  if (role !== 'farmer' && role !== 'extension_officer' && role !== 'admin') return null;

  const user: AuthedUser = {
    uid: account.localId,
    email: account.email || readString(f, 'email'),
    name: readString(f, 'displayName') || account.displayName || '',
    phone: readString(f, 'phone'),
    district: readString(f, 'district'),
    epa: readString(f, 'epa'),
    role,
  };

  if (cache.size > 500) cache.clear();
  cache.set(idToken, { user, expires: Date.now() + CACHE_MS });
  return user;
}

function bearer(req: Request): string | null {
  const header = req.get('authorization') || '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1].trim() : null;
}

/** Requires a signed-in user who has completed sign-up. */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = bearer(req);
  if (!token) {
    res.status(401).json({ error: 'Please sign in to continue.' });
    return;
  }
  try {
    const user = await loadUser(token);
    if (!user) {
      res.status(401).json({ error: 'Your session is invalid or your account is not set up. Please sign in again.' });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth check failed:', err);
    res.status(503).json({ error: 'Could not verify your sign-in right now. Please try again.' });
  }
}

/** Requires a signed-in user with one of the given roles. */
export function requireRole(...roles: Role[]) {
  return [
    requireAuth,
    (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ error: 'You do not have permission to do this.' });
        return;
      }
      next();
    },
  ];
}

/** Attaches req.user when a valid token is present, but never blocks the request. */
export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = bearer(req);
  if (token) {
    try {
      const user = await loadUser(token);
      if (user) req.user = user;
    } catch {
      // ignore: treated as a guest
    }
  }
  next();
}
