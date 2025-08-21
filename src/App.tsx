import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardLayout } from "./components/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StartFreeTrial from "./pages/StartFreeTrial";
import ScheduleDemo from "./pages/ScheduleDemo";
import Dashboard from "./pages/dashboard/Dashboard";
import Orders from "./pages/dashboard/Orders";
import Inventory from "./pages/dashboard/Inventory";
import Listings from "./pages/dashboard/Listings";
import Themes from "./pages/dashboard/Themes";
import Analytics from "./pages/dashboard/Analytics";
import Marketing from "./pages/dashboard/Marketing";
import WhatsApp from "./pages/dashboard/WhatsApp";
import Payments from "./pages/dashboard/Payments";
import Reports from "./pages/dashboard/Reports"; 
import BusinessReports from "./pages/dashboard/BusinessReports";
import ShippingPerformance from "./pages/dashboard/ShippingPerformance";
import Delivery from "./pages/dashboard/Delivery";
import Returns from "./pages/dashboard/Returns";
import Claims from "./pages/dashboard/Claims";
import Coupons from "./pages/dashboard/Coupons";
import Profile from "./pages/dashboard/Profile";
import Support from "./pages/dashboard/Support";
import Reviews from "./pages/dashboard/Reviews";
import Documents from "./pages/dashboard/Documents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/start-free-trial" element={<StartFreeTrial />} />
            <Route path="/schedule-demo" element={<ScheduleDemo />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="listings" element={<Listings />} />
              <Route path="themes" element={<Themes />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="marketing" element={<Marketing />} />
            <Route path="whatsapp" element={<WhatsApp />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="business-reports" element={<BusinessReports />} />
            <Route path="shipping-performance" element={<ShippingPerformance />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="returns" element={<Returns />} />
            <Route path="claims" element={<Claims />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<Support />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="documents" element={<Documents />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
