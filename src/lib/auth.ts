import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

export async function createToken(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) return null;

  return await verifyToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();

  // Allow overriding the secure flag via AUTH_COOKIE_SECURE env var.
  // If not provided, default to secure in production only if HTTPS is available
  const secureFlag =
    typeof process.env.AUTH_COOKIE_SECURE !== 'undefined'
      ? String(process.env.AUTH_COOKIE_SECURE).toLowerCase() === 'true'
      : process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https://');

  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: secureFlag,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
    // Add domain if specified in environment
    ...(process.env.COOKIE_DOMAIN && { domain: process.env.COOKIE_DOMAIN }),
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  // Delete cookie on the same path it was set to ensure it is removed in browsers.
  try {
    cookieStore.delete('auth-token');
  } catch (e) {
    // Some Next versions accept options for delete; attempt a path-based delete as a fallback.
    try {
      // @ts-expect-error - runtime option in some versions
      cookieStore.delete('auth-token', { path: '/' });
    } catch (_err) {
      // swallow - best effort delete
    }
  }
}

export async function requireAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  return await verifyToken(token);
}