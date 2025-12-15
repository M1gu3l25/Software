// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import AnNutritionPage from "./AnNutritionPage";   // landing pública
import LoginPage from "./login";
import Principal from "./principal";
import PrincipalAdmin from "./principalAdmin";
import Asesora from "./Asesora";
import Asesor from "./Asesor";

import ForgotPasswordPage from "./olvido";
import SignupPage from "./crearCuenta";

function getStoredUser() {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    // Si no hay token, manda siempre al login
    return <Navigate to="/login" replace />;
  }
  return children;
};

const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const user = getStoredUser();
  if (!user || user.role !== "admin") {
    // Si no es admin, mándalo al panel de usuario
    return <Navigate to="/principal" replace />;
  }
  return children;
};

export default function App() {
  const user = getStoredUser();
  const defaultAfterLogin = user?.role === "admin" ? "/admin" : "/principal";

  return (
    <Routes>
      {/*LANDING PÚBLICA — SIEMPRE SE MUESTRA EN "/" */}
      <Route path="/" element={<AnNutritionPage />} />

      {/*LOGIN */}
      <Route
        path="/login"
        element={
          user ? (
            // Si ya está logueado y entra al login, redirige al panel
            <Navigate to={defaultAfterLogin} replace />
          ) : (
            <LoginPage />
          )
        }
      />

      {/*CREAR CUENTA (público, igual que login) */}
      <Route
        path="/crear-cuenta"
        element={
          user ? (
            <Navigate to={defaultAfterLogin} replace />
          ) : (
            <SignupPage />
          )
        }
      />

      {/*¿OLVIDASTE TU CONTRASEÑA? (público) */}
      <Route
        path="/olvido"
        element={
          user ? (
            <Navigate to={defaultAfterLogin} replace />
          ) : (
            <ForgotPasswordPage />
          )
        }
      />

      {/*VISTA USUARIO NORMAL */}
      <Route
        path="/principal"
        element={
          <RequireAuth>
            <Principal />
          </RequireAuth>
        }
      />

      {/*PERFILES DE ASESORES (PROTEGIDOS IGUAL QUE PRINCIPAL) */}
      <Route
        path="/asesora"
        element={
          <RequireAuth>
            <Asesora />
          </RequireAuth>
        }
      />
      <Route
        path="/asesor"
        element={
          <RequireAuth>
            <Asesor />
          </RequireAuth>
        }
      />

      {/*VISTA ADMIN */}
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <RequireAdmin>
              <PrincipalAdmin />
            </RequireAdmin>
          </RequireAuth>
        }
      />

      {/*Cualquier otra ruta → landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
