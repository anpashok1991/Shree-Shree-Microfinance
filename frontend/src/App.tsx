import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import LandingPage from './pages/public/LandingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CustomerListPage from './pages/customers/CustomerListPage';
import CustomerFormPage from './pages/customers/CustomerFormPage';
import CustomerDetailPage from './pages/customers/CustomerDetailPage';
import LoanListPage from './pages/loans/LoanListPage';
import LoanFormPage from './pages/loans/LoanFormPage';
import LoanDetailPage from './pages/loans/LoanDetailPage';
import CollectionPage from './pages/collections/CollectionPage';
import UserListPage from './pages/users/UserListPage';
import AreaListPage from './pages/areas/AreaListPage';
import ReportPage from './pages/reports/ReportPage';
import SettingsPage from './pages/settings/SettingsPage';
import BorrowerLayout from './pages/borrower/BorrowerLayout';
import BorrowerDashboard from './pages/borrower/BorrowerDashboard';
import ApplyLoanPage from './pages/borrower/ApplyLoanPage';
import MyLoansPage from './pages/borrower/MyLoansPage';
import BorrowerLoanDetailPage from './pages/borrower/LoanDetailPage';
import EditProfilePage from './pages/borrower/EditProfilePage';
import EnquiryListPage from './pages/enquiries/EnquiryListPage';
import ProfilePage from './pages/profile/ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/borrower" element={<BorrowerLayout />}>
              <Route index element={<BorrowerDashboard />} />
              <Route path="apply" element={<ApplyLoanPage />} />
              <Route path="loans" element={<MyLoansPage />} />
              <Route path="loans/:id" element={<BorrowerLoanDetailPage />} />
              <Route path="profile" element={<EditProfilePage />} />
            </Route>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/customers" element={<CustomerListPage />} />
              <Route path="/customers/new" element={<CustomerFormPage />} />
              <Route path="/customers/edit/:id" element={<CustomerFormPage />} />
              <Route path="/customers/:id" element={<CustomerDetailPage />} />
              <Route path="/loans" element={<LoanListPage />} />
              <Route path="/loans/new" element={<LoanFormPage />} />
              <Route path="/loans/:id" element={<LoanDetailPage />} />
              <Route path="/collections" element={<CollectionPage />} />
              <Route path="/users" element={<UserListPage />} />
              <Route path="/areas" element={<AreaListPage />} />
              <Route path="/reports" element={<ReportPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/enquiries" element={<EnquiryListPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/app" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
