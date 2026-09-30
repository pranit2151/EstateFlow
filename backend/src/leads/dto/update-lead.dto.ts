import {
  IsString, IsEmail, IsOptional, IsNumber,
  IsEnum, Matches, IsPositive,
} from 'class-validator';
import { PropertyType, LeadSource, LeadStatus } from '../entities/lead.entity';

// All fields optional for partial updates
export class UpdateLeadDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone must be exactly 10 digits' })
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  budget?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(PropertyType)
  @IsOptional()
  property_type?: PropertyType;

  @IsEnum(LeadSource)
  @IsOptional()
  source?: LeadSource;

  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;
}
