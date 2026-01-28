import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const [totalStartups, totalInvestors] = await Promise.all([
      prisma.user.count({ where: { role: 'STARTUP' } }),
      prisma.user.count({ where: { role: 'INVESTOR' } }),
    ]);
    
    return NextResponse.json({
      success: true,
      data: {
        totalStartups,
        totalInvestors,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
