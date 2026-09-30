import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LeadsModule } from './leads/leads.module';
import { NotesModule } from './notes/notes.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    // Load .env file
    ConfigModule.forRoot({ isGlobal: true }),

    // Prisma (global) replaces TypeORM
    PrismaModule,

    // Feature modules
    AuthModule,
    LeadsModule,
    NotesModule,
    DashboardModule,
  ],
})
export class AppModule {}
