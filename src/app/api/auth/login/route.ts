import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { createToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if teacher is approved
    if (user.role === 'teacher' && !user.approved) {
      return NextResponse.json(
        { message: 'Your account is pending admin approval' },
        { status: 403 }
      );
    }

    // Create token
    const token = await createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      approved: user.approved,
    });

    console.log('Login - Environment:', {
      nodeEnv: process.env.NODE_ENV,
      authCookieSecure: process.env.AUTH_COOKIE_SECURE,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      cookieDomain: process.env.COOKIE_DOMAIN,
    });

    // Set cookie
    await setAuthCookie(token);

    console.log('Login successful for user:', user.email, 'Role:', user.role);

    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}