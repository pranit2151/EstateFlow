import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { config } from 'dotenv';

config(); // Load .env

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('Connected to database.');

  // Clear existing data (order matters due to foreign keys)
  await prisma.note.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared old data.');

  // Create demo user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@crm.com',
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log(`Created user: ${user.email} / password123`);

  // Seed leads
  const leads = await Promise.all([
    prisma.lead.create({ data: { name: 'Rajesh Sharma', phone: '9876543210', email: 'rajesh@gmail.com', budget: 7500000, location: 'Bandra West, Mumbai', property_type: 'BHK2', source: 'Google', status: 'Contacted' } }),
    prisma.lead.create({ data: { name: 'Priya Patel', phone: '9823456789', email: 'priya.p@yahoo.com', budget: 4500000, location: 'Koramangala, Bangalore', property_type: 'BHK1', source: 'Facebook', status: 'New' } }),
    prisma.lead.create({ data: { name: 'Amit Deshmukh', phone: '9812345678', email: 'amit.d@outlook.com', budget: 15000000, location: 'Whitefield, Bangalore', property_type: 'BHK3', source: 'Referral', status: 'Site_Visit' } }),
    prisma.lead.create({ data: { name: 'Sneha Kulkarni', phone: '9834567890', email: 'sneha.k@gmail.com', budget: 9200000, location: 'Hinjewadi, Pune', property_type: 'BHK2', source: 'Website', status: 'Closed' } }),
    prisma.lead.create({ data: { name: 'Vikram Singh', phone: '9845678901', email: 'vikram.s@gmail.com', budget: 25000000, location: 'Golf Course Road, Gurgaon', property_type: 'BHK4', source: 'Walk_in', status: 'Contacted' } }),
    prisma.lead.create({ data: { name: 'Ananya Reddy', phone: '9856789012', email: 'ananya.r@gmail.com', budget: 6000000, location: 'Jubilee Hills, Hyderabad', property_type: 'BHK2', source: 'Google', status: 'New' } }),
    prisma.lead.create({ data: { name: 'Karan Mehta', phone: '9867890123', email: 'karan.m@gmail.com', budget: 35000000, location: 'Worli, Mumbai', property_type: 'Commercial', source: 'Referral', status: 'Site_Visit' } }),
    prisma.lead.create({ data: { name: 'Nisha Gupta', phone: '9878901234', email: 'nisha.g@gmail.com', budget: 3500000, location: 'Noida Sector 62', property_type: 'BHK1', source: 'Facebook', status: 'Contacted' } }),
    prisma.lead.create({ data: { name: 'Rohit Verma', phone: '9889012345', email: 'rohit.v@gmail.com', budget: 12000000, location: 'Baner, Pune', property_type: 'BHK3', source: 'Website', status: 'Closed' } }),
    prisma.lead.create({ data: { name: 'Deepa Nair', phone: '9890123456', email: 'deepa.n@gmail.com', budget: 8000000, location: 'Adyar, Chennai', property_type: 'Plot', source: 'Other', status: 'New' } }),
    prisma.lead.create({ data: { name: 'Suresh Iyer', phone: '9801234567', email: 'suresh.i@gmail.com', budget: 5500000, location: 'Indiranagar, Bangalore', property_type: 'BHK2', source: 'Google', status: 'Contacted' } }),
    prisma.lead.create({ data: { name: 'Meena Joshi', phone: '9811234567', email: 'meena.j@gmail.com', budget: 18000000, location: 'Powai, Mumbai', property_type: 'BHK4', source: 'Walk_in', status: 'Closed' } }),
  ]);
  console.log(`Created ${leads.length} leads.`);

  // Seed some notes
  await prisma.note.createMany({
    data: [
      { text: 'Interested in 2BHK near station. Follow up next week.', lead_id: leads[0].id },
      { text: 'Budget is flexible up to 80L for right property.', lead_id: leads[0].id },
      { text: 'Looking for immediate possession. Ready to visit sites.', lead_id: leads[2].id },
      { text: 'Visited sample flat on 15th Sept. Very interested.', lead_id: leads[2].id },
      { text: 'Deal closed! Booked 2BHK in Green Valley.', lead_id: leads[3].id },
      { text: 'Prefers gated community with gym and pool.', lead_id: leads[4].id },
      { text: 'First-time buyer. Needs help with home loan process.', lead_id: leads[1].id },
      { text: 'Looking for commercial space for IT office. 2000 sq ft.', lead_id: leads[6].id },
    ],
  });
  console.log('Created sample notes.');

  await prisma.$disconnect();
  await pool.end();
  console.log('\nSeed complete! Login with: admin@crm.com / password123');
}

seed().catch(console.error);
