import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "@/components/Shell";
import { DashboardPage } from "@/pages/DashboardPage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { SocialPage } from "@/pages/SocialPage";
import { RewardsPage } from "@/pages/RewardsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="social" element={<SocialPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
