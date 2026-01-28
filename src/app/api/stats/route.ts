import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const [totalStartups, totalInvestors, totalFundingResult] = await Promise.all([
      prisma.user.count({ where: { role: 'STARTUP' } }),
      prisma.user.count({ where: { role: 'INVESTOR' } }),
      // Sum all completed funding agreements
      prisma.successfulFunding.aggregate({
        _sum: {
          fundingAmount: true,
        },
      }),
    ]);

    // Convert total funding from decimal to number, default to 0 if no fundings yet
    const totalInvested = totalFundingResult._sum.fundingAmount
      ? Number(totalFundingResult._sum.fundingAmount)
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalStartups,
        totalInvestors,
        totalInvested, // Total amount invested in rupees
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
