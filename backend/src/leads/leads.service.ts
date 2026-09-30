import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStatus } from './entities/lead.entity';
import { Prisma } from '@prisma/client';

const toPrismaProp = (val: string) => val.replace(/(\d)BHK/, 'BHK$1');
const toPrismaSource = (val: string) => val.replace('-', '_');
const toPrismaStatus = (val?: string) => val ? val.replace(' ', '_') : undefined;

const fromPrismaProp = (val: string) => val ? val.replace(/BHK(\d)/, '$1BHK') : val;
const fromPrismaSource = (val: string) => val ? val.replace('_', '-') : val;
const fromPrismaStatus = (val?: string) => val ? val.replace('_', ' ') : undefined;

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  private mapLead(lead: any) {
    if (!lead) return lead;
    return {
      ...lead,
      property_type: fromPrismaProp(lead.property_type),
      source: fromPrismaSource(lead.source),
      status: fromPrismaStatus(lead.status),
    };
  }

  // Create a new lead
  async create(dto: CreateLeadDto) {
    try {
      const result = await this.prisma.lead.create({
        data: {
          name: dto.name,
          phone: dto.phone,
          email: dto.email,
          budget: dto.budget,
          location: dto.location,
          property_type: toPrismaProp(dto.property_type) as any,
          source: toPrismaSource(dto.source) as any,
          status: toPrismaStatus(dto.status as any) as any,
        },
      });
      return this.mapLead(result);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A lead with this phone number already exists');
      }
      throw error;
    }
  }

  // Get all leads with search, filter, sort, and pagination
  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: LeadStatus;
    source?: string;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {};

    // Search by name, email, or phone (case-insensitive)
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { email: { contains: query.search, mode: 'insensitive' } },
        { phone: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Filter by status
    if (query.status) {
      where.status = toPrismaStatus(query.status as any) as any;
    }

    // Filter by source
    if (query.source) {
      where.source = toPrismaSource(query.source as any) as any;
    }

    // Sort
    const sortBy = query.sortBy || 'created_at';
    const order = (query.order || 'DESC').toLowerCase() as 'asc' | 'desc';
    const orderBy: Prisma.LeadOrderByWithRelationInput = { [sortBy]: order };

    const [data, total] = await Promise.all([
      this.prisma.lead.findMany({ where, orderBy, skip, take: limit }),
      this.prisma.lead.count({ where }),
    ]);

    return {
      data: data.map(l => this.mapLead(l)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // Get single lead with notes
  async findOne(id: number) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: { notes: { orderBy: { created_at: 'desc' } } },
    });
    if (!lead) throw new NotFoundException(`Lead #${id} not found`);
    return this.mapLead(lead);
  }

  // Update a lead
  async update(id: number, dto: UpdateLeadDto) {
    await this.findOne(id); // Ensure it exists
    const dataToUpdate: any = { ...dto };
    if (dto.property_type) dataToUpdate.property_type = toPrismaProp(dto.property_type as any);
    if (dto.source) dataToUpdate.source = toPrismaSource(dto.source as any);
    if (dto.status) dataToUpdate.status = toPrismaStatus(dto.status as any);

    try {
      const result = await this.prisma.lead.update({
        where: { id },
        data: dataToUpdate,
      });
      return this.mapLead(result);
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A lead with this phone number already exists');
      }
      throw error;
    }
  }

  // Update only the status field
  async updateStatus(id: number, status: LeadStatus) {
    await this.findOne(id); // Ensure it exists
    const result = await this.prisma.lead.update({
      where: { id },
      data: { status: toPrismaStatus(status as any) as any },
    });
    return this.mapLead(result);
  }

  // Delete a lead (cascade handled by Prisma schema)
  async remove(id: number): Promise<void> {
    await this.findOne(id); // Ensure it exists
    await this.prisma.lead.delete({ where: { id } });
  }
}
