import {
  IsString, IsNotEmpty, IsEmail, IsOptional, IsNumber,
  IsEnum, Matches, Min, Max, IsPositive,
} from 'class-validator';
import { PropertyType, LeadSource, LeadStatus } from '../entities/lead.entity';

export class CreateLeadDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'Phone must be exactly 10 digits' })
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsPositive()
  @Max(9999999999, { message: 'Budget must be less than 10 billion' })
  budget: number;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsEnum(PropertyType)
  property_type: PropertyType;

  @IsEnum(LeadSource)
  source: LeadSource;

  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;
}
