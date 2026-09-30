import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getSummary() {
    const total = await this.prisma.lead.count();
    const closed = await this.prisma.lead.count({ where: { status: 'Closed' as any } });
    const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

    // Count leads grouped by source
    const sourceRows = await this.prisma.lead.groupBy({
      by: ['source'],
      _count: { _all: true },
    });

    const bySource: Record<string, number> = {};
    sourceRows.forEach((row) => (bySource[row.source] = row._count._all));

    // Count leads grouped by status
    const statusRows = await this.prisma.lead.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    const byStatus: Record<string, number> = {};
    statusRows.forEach((row) => (byStatus[row.status] = row._count._all));

    return { total, closed, conversionRate, bySource, byStatus };
  }
}
