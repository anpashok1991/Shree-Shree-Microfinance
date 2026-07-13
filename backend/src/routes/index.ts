import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import areaRoutes from './areas';
import customerRoutes from './customers';
import loanRoutes from './loans';
import collectionRoutes from './collections';
import dashboardRoutes from './dashboard';
import reportRoutes from './reports';
import settingsRoutes from './settings';
import searchRoutes from './search';
import expenseRoutes from './expenses';
import publicRoutes from './public';
import uploadRoutes from './upload';
import enquiryRoutes from './enquiries';
import borrowerRoutes from './borrower';
import receiptRoutes from './receipts';

const router = Router();

router.use('/public', publicRoutes);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/areas', areaRoutes);
router.use('/customers', customerRoutes);
router.use('/loans', loanRoutes);
router.use('/collections', collectionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportRoutes);
router.use('/settings', settingsRoutes);
router.use('/search', searchRoutes);
router.use('/expenses', expenseRoutes);
router.use('/uploads', uploadRoutes);
router.use('/enquiries', enquiryRoutes);
router.use('/borrower', borrowerRoutes);
router.use('/receipts', receiptRoutes);

export default router;
