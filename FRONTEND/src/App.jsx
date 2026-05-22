import {Routes, Route ,Navigate, useLocation} from "react-router";
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
import ChatBox from "./components/ChatBox";

function App(){
  
  const dispatch = useDispatch();
  const {isAuthenticated,user,loading} = useSelector((state)=>state.auth);
  const location = useLocation();
  const isProblemPage = location.pathname.startsWith('/problem/');

  // check initial authentication
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return(
  <div className="flex flex-col min-h-screen relative">
    {isAuthenticated && <Navbar />}
    <div className="flex-grow">
      <Routes>
        <Route path="/" element={isAuthenticated ?<Homepage></Homepage>:<Navigate to="/signup" />}></Route>
        <Route path="/problems" element={isAuthenticated ? <ProblemsPage /> : <Navigate to="/signup" />} />
        <Route path="/login" element={isAuthenticated?<Navigate to="/" />:<Login></Login>}></Route>
        <Route path="/signup" element={isAuthenticated?<Navigate to="/" />:<Signup></Signup>}></Route>
        <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <Admin /> : <Navigate to="/" />} />
        <Route path="/admin/create" element={isAuthenticated && user?.role === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
        <Route path="/admin/delete" element={isAuthenticated && user?.role === 'admin' ? <AdminDelete /> : <Navigate to="/" />} />
        <Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
        <Route path="/admin/video" element={isAuthenticated && user?.role === 'admin' ? <AdminVideo /> : <Navigate to="/" />} />
        <Route path="/admin/upload/:problemId" element={isAuthenticated && user?.role === 'admin' ? <AdminUpload /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/" />} />
        <Route path="/redeem" element={<RedeemStore />} />
        <Route path="/contests" element={isAuthenticated ? <Contests /> : <Navigate to="/" />} />
        <Route path="/contest/:id" element={isAuthenticated ? <ContestDetail /> : <Navigate to="/" />} />
        <Route path="/forums" element={<Navigate to="/forum" />} />
        <Route path="/forum" element={isAuthenticated ? <DiscussionsPage /> : <Navigate to="/" />} />
        <Route path="/forum/post/:id" element={isAuthenticated ? <DiscussionDetail /> : <Navigate to="/" />} />
        <Route path="/forum/new" element={isAuthenticated ? <CreateDiscussion /> : <Navigate to="/" />} />
      </Routes>
    </div>
    {isAuthenticated && <ChatBox />}
    {isAuthenticated && !isProblemPage && <Footer />}
  </div>
  )
}

export default App;