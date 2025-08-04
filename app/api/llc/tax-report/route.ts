import { NextRequest, NextResponse } from 'next/server';
import { codeklayPaymentService } from '@/lib/platform-payment-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate tax report for CodeKlay platform
const taxReport = await codeklayPaymentService.generateTaxReport(start, end);

    return NextResponse.json({
      success: true,
      report: taxReport,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Tax report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tax report' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { startDate, endDate, includeOtherPlatforms = false } = await request.json();

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Generate comprehensive LLC tax report
    const codeklayReport = await codeklayPaymentService.generateTaxReport(start, end);

    const llcReport = {
      businessName: 'Your LLC Name',
      taxId: 'XX-XXXXXXX', // Your LLC's tax ID
      period: {
        start: start,
        end: end,
      },
      platforms: {
        codeklay: codeklayReport,
        // Add other platforms here when needed
        // otherPlatform: await otherPlatformService.generateTaxReport(start, end),
      },
      totalRevenue: codeklayReport.revenue, // Sum all platforms
totalTransactions: codeklayReport.transactionCount,
estimatedTax: codeklayReport.estimatedTax,
      currency: 'usd',
    };

    return NextResponse.json({
      success: true,
      llcReport,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('LLC tax report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate LLC tax report' },
      { status: 500 }
    );
  }
} 