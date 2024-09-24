import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LoginPage from "./pages/LoginPage";
import CallbackPage from "./pages/CallbackPage";
import HomePage from "./pages/HomePage";
import Leaderboard from "./components/Leaderboard";
import FindTreasure from "./pages/FindTreasure";
import TreasureVault from "./pages/TreasureVault";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/findtreasure" element={<FindTreasure />} />
        <Route path="/treasurevault" element={<TreasureVault />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
