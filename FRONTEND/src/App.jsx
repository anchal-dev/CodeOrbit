import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { checkAuth } from "./authSlice";
import { useDispatch, useSelector } from "react-redux";

function App() {
const {isAuthenticated}= useSelector((state) => state.auth);
const dispatch = useDispatch();


useEffect(() => {
  dispatch(checkAuth());
}, [isAuthenticated]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;