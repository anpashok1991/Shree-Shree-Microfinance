import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { logger } from '../config/logger';
import { config } from '../config';

export async function seedAdmin() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: config.admin.email },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(config.admin.password, 12);

      await prisma.user.create({
        data: {
          email: config.admin.email,
          password: hashedPassword,
          name: 'Super Admin',
          phone: config.admin.phone,
          role: 'SUPER_ADMIN',
          status: 'ACTIVE',
        },
      });

      logger.info('Super Admin created successfully');
      console.log('  ✓ Super Admin created');
    }

    const defaultSettings = [
      { key: 'company_name', value: 'Shree Shree Group' },
      { key: 'company_address', value: '' },
      { key: 'company_phone', value: config.admin.phone },
      { key: 'company_email', value: config.admin.email },
      { key: 'file_charge_percent', value: '3' },
      { key: 'renewal_charge_percent', value: '20' },
      { key: 'foreclosure_charge_percent', value: '0' },
      { key: 'max_loan', value: '50000' },
      { key: 'min_loan', value: '5000' },
      { key: 'loan_tenure_days', value: '100' },
      { key: 'interest_rate', value: '20' },
      { key: 'currency', value: 'INR' },
      { key: 'language', value: 'en' },
    ];

    for (const setting of defaultSettings) {
      const existing = await prisma.systemSetting.findUnique({
        where: { key: setting.key },
      });
      if (!existing) {
        await prisma.systemSetting.create({ data: setting });
      }
    }

    logger.info('Default settings initialized');
  } catch (error) {
    logger.error('Seed error:', error);
  }
}

if (require.main === module) {
  seedAdmin()
    .then(() => {
      console.log('Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
