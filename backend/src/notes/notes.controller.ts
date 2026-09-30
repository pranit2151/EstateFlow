import { Controller, Post, Get, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leads/:leadId/notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  create(
    @Param('leadId', ParseIntPipe) leadId: number,
    @Body() dto: CreateNoteDto,
  ) {
    return this.notesService.create(leadId, dto);
  }

  @Get()
  findAll(@Param('leadId', ParseIntPipe) leadId: number) {
    return this.notesService.findByLead(leadId);
  }
}
