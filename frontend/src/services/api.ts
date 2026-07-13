import axios, { AxiosError } from 'axios';

export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),
  register: (data: any) =>
    api.post('/auth/register', data).then((r) => r.data),
  getProfile: () => api.get('/auth/profile').then((r) => r.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),
};

export const userApi = {
  getAll: (page?: number, limit?: number) =>
    api.get('/users', { params: { page, limit } }).then((r) => r.data),
  getById: (id: string) => api.get(`/users/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/users', data).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/users/${id}`).then((r) => r.data),
  toggleStatus: (id: string, status: string) =>
    api.put(`/users/${id}/status`, { status }).then((r) => r.data),
  lock: (id: string) => api.put(`/users/${id}/lock`).then((r) => r.data),
  unlock: (id: string) => api.put(`/users/${id}/unlock`).then((r) => r.data),
  resetPassword: (id: string, newPassword: string) =>
    api.put(`/users/${id}/reset-password`, { newPassword }).then((r) => r.data),
  getStaff: () => api.get('/users/staff').then((r) => r.data),
};

export const areaApi = {
  getAll: () => api.get('/areas').then((r) => r.data),
  getById: (id: string) => api.get(`/areas/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/areas', data).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/areas/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/areas/${id}`).then((r) => r.data),
};

export const customerApi = {
  getAll: (params?: any) => api.get('/customers', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/customers/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/customers', data).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/customers/${id}`).then((r) => r.data),
  search: (q: string) => api.get('/customers/search', { params: { q } }).then((r) => r.data),
};

export const loanApi = {
  getAll: (params?: any) => api.get('/loans', { params }).then((r) => r.data),
  getById: (id: string) => api.get(`/loans/${id}`).then((r) => r.data),
  create: (data: any) => api.post('/loans', data).then((r) => r.data),
  getPending: () => api.get('/loans/pending').then((r) => r.data),
  approve: (id: string) => api.put(`/loans/${id}/approve`).then((r) => r.data),
  reject: (id: string, reason: string) =>
    api.put(`/loans/${id}/reject`, { reason }).then((r) => r.data),
  return: (id: string, reason: string) =>
    api.put(`/loans/${id}/return`, { reason }).then((r) => r.data),
  renew: (id: string) => api.post(`/loans/${id}/renew`).then((r) => r.data),
  update: (id: string, data: any) => api.put(`/loans/${id}`, data).then((r) => r.data),
  calculate: (amount: number) =>
    api.get('/loans/calculate', { params: { amount } }).then((r) => r.data),
};

export const collectionApi = {
  getAll: (params?: any) => api.get('/collections', { params }).then((r) => r.data),
  create: (data: any) => api.post('/collections', data).then((r) => r.data),
  getTodayStats: () => api.get('/collections/today/stats').then((r) => r.data),
  void: (id: string) => api.delete(`/collections/${id}`).then((r) => r.data),
};

export const receiptApi = {
  getByCollection: (collectionId: string) => api.get(`/receipts/collection/${collectionId}`).then((r) => r.data),
  getByLoan: (loanId: string) => api.get(`/receipts/loan/${loanId}`).then((r) => r.data),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats').then((r) => r.data),
  getMonthlyChart: (year?: number) =>
    api.get('/dashboard/monthly-chart', { params: { year } }).then((r) => r.data),
  getAreaWise: () => api.get('/dashboard/area-wise').then((r) => r.data),
  getStaffPerformance: () => api.get('/dashboard/staff-performance').then((r) => r.data),
};

export const reportApi = {
  dailyCollection: (date?: string) =>
    api.get('/reports/daily-collection', { params: { date } }).then((r) => r.data),
  monthlyCollection: (year?: number, month?: number) =>
    api.get('/reports/monthly-collection', { params: { year, month } }).then((r) => r.data),
  customerLedger: (customerId: string) =>
    api.get(`/reports/customer-ledger/${customerId}`).then((r) => r.data),
  loanLedger: (loanId: string) =>
    api.get(`/reports/loan-ledger/${loanId}`).then((r) => r.data),
  outstanding: () => api.get('/reports/outstanding').then((r) => r.data),
  defaulters: (days?: number) =>
    api.get('/reports/defaulters', { params: { days } }).then((r) => r.data),
  renewals: () => api.get('/reports/renewals').then((r) => r.data),
  profit: (startDate?: string, endDate?: string) =>
    api.get('/reports/profit', { params: { startDate, endDate } }).then((r) => r.data),
};

export const settingsApi = {
  getAll: () => api.get('/settings').then((r) => r.data),
  getByKey: (key: string) => api.get(`/settings/${key}`).then((r) => r.data),
  update: (key: string, value: string) =>
    api.put(`/settings/${key}`, { value }).then((r) => r.data),
  resetAllData: () => api.post('/settings/reset-all-data').then((r) => r.data),
};

export const publicApi = {
  getCompanyInfo: () => api.get('/public/company-info').then((r) => r.data),
};

export const uploadApi = {
  logo: (formData: FormData) =>
    api.post('/uploads/logo', formData).then((r) => r.data),
  customerDocs: (customerId: string, formData: FormData) =>
    api.post(`/uploads/customer-docs/${customerId}`, formData).then((r) => r.data),
};

export const enquiryApi = {
  create: (data: any) => api.post('/enquiries', data).then((r) => r.data),
  getAll: (page?: number) => api.get('/enquiries', { params: { page } }).then((r) => r.data),
  markRead: (id: string) => api.put(`/enquiries/${id}/read`).then((r) => r.data),
  respond: (id: string, response: string) =>
    api.put(`/enquiries/${id}/respond`, { response }).then((r) => r.data),
};

export const borrowerApi = {
  getMyLoans: () => api.get('/loans', { params: { customerId: 'me' } }).then((r) => r.data),
  applyLoan: (data: any) => api.post('/loans/borrower-apply', data).then((r) => r.data),
  getProfile: () => api.get('/borrower/profile').then((r) => r.data),
  updateProfile: (data: any) => api.put('/borrower/profile', data).then((r) => r.data),
  getLoanDetail: (id: string) => api.get(`/borrower/loans/${id}`).then((r) => r.data),
};

export const searchApi = {
  global: (q: string) => api.get('/search', { params: { q } }).then((r) => r.data),
};

export const expenseApi = {
  getAll: (params?: any) => api.get('/expenses', { params }).then((r) => r.data),
  create: (data: any) => api.post('/expenses', data).then((r) => r.data),
  delete: (id: string) => api.delete(`/expenses/${id}`).then((r) => r.data),
};

export function resolveUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path;
  const base = API_BASE.replace('/api', '');
  return `${base}${path}`;
}

export function whatsappLink(phone: string, text: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/91${cleaned}?text=${encodeURIComponent(text)}`;
}

export function getWhatsappNumber(): string {
  return '918765432100';
}

export default api;
