import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';

/**
 * GET /api/profile-image?id={userId}
 * Fetch user's profile image from InvestorProfile or StartupProfile
 */
export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const { prisma } = getContext();
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get('id');

      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'User ID is required' },
          { status: 400 }
        );
      }

      // First, get the user to determine their role
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }

      let photoUrl: string | null = null;

      // Fetch profile photo based on user role
      if (user.role === 'INVESTOR') {
        const investorProfile = await prisma.investorProfile.findUnique({
          where: { userId },
          select: { photo: true },
        });
        photoUrl = investorProfile?.photo || null;
      } else if (user.role === 'STARTUP') {
        const startupProfile = await prisma.startupProfile.findUnique({
          where: { userId },
          select: { photo: true },
        });
        photoUrl = startupProfile?.photo || null;
      }

      if (!photoUrl) {
        return NextResponse.json(
          { success: false, error: 'Profile image not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        url: photoUrl,
      });
    } catch (error: any) {
      console.error('Profile image fetch error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch profile image' },
        { status: 500 }
      );
    }
  });
}
