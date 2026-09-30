import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  // Add a note to a lead
  async create(leadId: number, dto: CreateNoteDto) {
    // Verify lead exists
    const lead = await this.prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException(`Lead #${leadId} not found`);

    return await this.prisma.note.create({
      data: { text: dto.text, lead_id: leadId },
    });
  }

  // Get all notes for a lead
  async findByLead(leadId: number) {
    return this.prisma.note.findMany({
      where: { lead_id: leadId },
      orderBy: { created_at: 'desc' },
    });
  }
}
