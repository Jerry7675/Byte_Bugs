import { NextRequest, NextResponse } from 'next/server';
import { withRequestContext } from '@/context/init-request-context';
import { getContext } from '@/context/context-store';
import { PrismaEnums } from '@/enumWrapper';

export async function GET(req: NextRequest) {
  return withRequestContext(req, async () => {
    try {
      const { prisma, user } = getContext();
      
      // Only admins can access this endpoint
      if (!user || user.role !== 'ADMIN') {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 403 }
        );
      }
      
      const [
        totalUsers,
        totalInvestors,
        totalStartups,
        pendingVerifications,
        totalPosts,
        totalConversations,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: PrismaEnums.UserRole.INVESTOR } }),
        prisma.user.count({ where: { role: PrismaEnums.UserRole.STARTUP } }),
        prisma.verificationStage.count({ 
          where: { 
            status: PrismaEnums.VerificationStageStatus.PENDING 
          } 
        }),
        prisma.post.count(),
        prisma.conversation.count(),
      ]);
      
      return NextResponse.json({
        success: true,
        data: {
          totalUsers,
          totalInvestors,
          totalStartups,
          pendingVerifications,
          totalPosts,
          totalConversations,
        },
      });
    } catch (error: any) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  });
}
