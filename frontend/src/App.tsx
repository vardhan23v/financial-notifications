import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import NotificationExplorerPage from "./pages/NotificationExplorerPage";
import EventSimulatorPage from "./pages/EventSimulatorPage";
import UsersPage from "./pages/UsersPage";
import TemplatesPage from "./pages/TemplatesPage";
import ProvidersPage from "./pages/ProvidersPage";
import DLQPage from "./pages/DLQPage";
import WebsiteViewerPage from "./pages/WebsiteViewerPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import PreferencesPage from "./pages/PreferencesPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="notifications" element={<NotificationExplorerPage />} />
          <Route path="simulator" element={<EventSimulatorPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="dlq" element={<DLQPage />} />
          <Route path="viewer" element={<WebsiteViewerPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="preferences" element={<PreferencesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}