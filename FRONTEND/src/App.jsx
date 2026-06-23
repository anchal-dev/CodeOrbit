import {Routes, Route, Navigate, useLocation} from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import ProblemsPage from "./pages/ProblemsPage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./components/AdminPanel";
import ProblemPage from "./pages/ProblemPage"
import Admin from "./pages/Admin";
import AdminDelete from "./components/AdminDelete"
import AdminVideo from "./components/AdminVideo";
import AdminUpload from "./components/AdminUpload";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import UserProfile from "./pages/UserProfile";
import RedeemStore from "./pages/RedeemStore";
import Contests from "./pages/Contests";
import ContestDetail from "./pages/ContestDetail";
import DiscussionsPage from "./pages/DiscussionsPage";
import DiscussionDetail from "./pages/DiscussionDetail";
import CreateDiscussion from "./pages/CreateDiscussion";
import GameZone from "./pages/GameZone";
import InterviewHub from "./pages/InterviewHub";
import CompanyHub from "./pages/CompanyHub";
import MockSession from "./pages/MockSession";
import ResumePrep from "./pages/ResumePrep";
import TrackHub from "./pages/TrackHub";

function App(){
  
  const dispatch = useDispatch();
  const { isAuthenticated, user, authChecking } = useSelector((state) => state.auth);
  const location = useLocation();
  const isProblemPage = location.pathname.startsWith('/problem/');

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0f1c]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center animate-pulse shadow-lg shadow-indigo-500/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <span className="text-slate-400 text-sm font-medium">Loading CodeOrbit…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Navbar is always visible — handles guest vs logged-in internally */}
      <Navbar />

      <div className="flex-grow">
        <Routes>
          {/* ── Public Routes (guests allowed) ── */}
          <Route path="/"               element={<Homepage />} />
          <Route path="/problems"       element={<ProblemsPage />} />
          <Route path="/problem/:problemId" element={<ProblemPage />} />
          <Route path="/contests"       element={<Contests />} />
          <Route path="/contest/:id"    element={<ContestDetail />} />
          <Route path="/forum"          element={<DiscussionsPage />} />
          <Route path="/forums"         element={<Navigate to="/forum" />} />
          <Route path="/forum/post/:id" element={<DiscussionDetail />} />
          <Route path="/redeem"         element={<RedeemStore />} />
          <Route path="/game"           element={isAuthenticated ? <GameZone /> : <Navigate to="/login" />} />

          {/* ── Interview Routes ── */}
          <Route path="/interview"                  element={isAuthenticated ? <InterviewHub />  : <Navigate to="/login" />} />
          <Route path="/interview/company/:companyName" element={isAuthenticated ? <CompanyHub />   : <Navigate to="/login" />} />
          <Route path="/interview/track/:trackName" element={isAuthenticated ? <TrackHub />     : <Navigate to="/login" />} />
          <Route path="/interview/mock-session"     element={isAuthenticated ? <MockSession />  : <Navigate to="/login" />} />
          <Route path="/interview/resume"           element={isAuthenticated ? <ResumePrep />   : <Navigate to="/login" />} />

          {/* ── Auth Routes (redirect away if already logged in) ── */}
          <Route path="/login"  element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />

          {/* ── Protected Routes (must be logged in) ── */}
          <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
          <Route path="/forum/new" element={isAuthenticated ? <CreateDiscussion /> : <Navigate to="/login" />} />

          {/* ── Admin Routes ── */}
          <Route path="/admin"               element={isAuthenticated && user?.role === 'admin' ? <Admin />       : <Navigate to="/" />} />
          <Route path="/admin/create"        element={isAuthenticated && user?.role === 'admin' ? <AdminPanel />  : <Navigate to="/" />} />
          <Route path="/admin/delete"        element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
          <Route path="/admin/video"         element={isAuthenticated && user?.role === 'admin' ? <AdminVideo />  : <Navigate to="/" />} />
          <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
        </Routes>
      </div>


      {/* Footer hidden on Problem pages */}
      {!isProblemPage && <Footer />}
    </div>
  );
}

export default App;