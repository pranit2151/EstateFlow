import { getEnumValues } from 'class-validator';
enum PropertyType {
  '1BHK' = '1BHK',
  '2BHK' = '2BHK',
  '3BHK' = '3BHK',
  '4BHK' = '4BHK',
  PLOT = 'Plot',
  COMMERCIAL = 'Commercial',
}
console.log(getEnumValues(PropertyType));
