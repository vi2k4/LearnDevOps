import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Home from "./pages/Home/Home";
import Friends from "./pages/Friends/Friends";
import Groups from "./pages/Groups/Groups";
import { useUserStore } from "./store/useStore";

function RequireAuth({ children }) {
  const user = useUserStore((s) => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/*"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Home />} />
          <Route path="friends" element={<Friends />} />
          <Route path="groups" element={<Groups />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
