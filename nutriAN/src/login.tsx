// src/login.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logoManzana from "./assets/images/manzana.png"; // tu logo
import "./styles/login.css";

const LoginPage: React.FC = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("admin@nutrian.com"); // solo de ejemplo
  const [password, setPassword] = useState("Admin123!");   // solo de ejemplo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Error al iniciar sesión");
      }

      const data = await res.json();

      // Guardar token y datos del usuario
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirigir según el rol
      if (data.user.role === "admin") {
        console.log("➡ Navegando a /admin");
        navigate("/admin");
      } else {
        console.log("➡ Navegando a /principal");
        navigate("/principal");
      }
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth auth--split">
      {/* Lado visual / branding */}
      <aside className="auth__brand">
        <div className="auth__brand-inner">
          <div className="brand">
            <img src={logoManzana} alt="AnNutrition" className="nav__icon" />
            <strong>AnNutrition</strong>
          </div>

          <div className="auth__lottie">
            {/* Icono animado */}
            <lottie-player
              src="/iconosAnimados/login.json"
              background="transparent"
              speed="1"
              loop
              autoplay
              style={{ width: 220, height: 220 }}
            />
          </div>

          <h2>Bienvenido de vuelta</h2>
          <p className="muted">
            Ingresa para administrar <b>Servicios</b>, <b>Material</b> y <b>Secciones</b>.
          </p>
        </div>
      </aside>

      {/* Lado del formulario */}
      <div className="auth__panel">
        <div className="auth__card">
          <h1 className="auth__title">Iniciar sesión</h1>
          <p className="auth__subtitle">Usa tu correo y contraseña</p>

          <form className="form" onSubmit={handleSubmit}>
            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Contraseña</label>
            <div className="input-with-action">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="chip-action"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
                title={showPwd ? "Ocultar" : "Mostrar"}
              >
                {showPwd ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0589c8" viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 
                    5-5 5 2.24 5 5-2.24 5-5 5z"/>
                    <circle cx="12" cy="12" r="2.5"/>
                    <line x1="2" y1="2" x2="22" y2="22" stroke="#0589c8" strokeWidth="2"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#0589c8" viewBox="0 0 24 24">
                    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.76 0-5-2.24-5-5s2.24-5 
                    5-5 5 2.24 5 5-2.24 5-5 5z"/>
                    <circle cx="12" cy="12" r="2.5"/>
                  </svg>
                )}
              </button>
            </div>

            <div className="auth__row">
              <label className="chk">
                <input type="checkbox" /> <span>Recuérdame</span>
              </label>
              {/*aquí usamos React Router */}
              <Link className="link" to="/olvido">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button className="btn-primary full" type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Entrar"}
            </button>

            <div className="auth__divider"><span>ó</span></div>

            <button className="btn-outline full" type="button">
              Continuar con Google
            </button>
          </form>

          <p className="muted center small" style={{ marginTop: 12 }}>
            ¿No tienes cuenta?{" "}
            <Link className="link" to="/crear-cuenta">
              Crear cuenta
            </Link>
          </p>
        </div>

        <footer className="auth__footer">
          © {new Date().getFullYear()} AnNutrition · Todos los derechos reservados
        </footer>
      </div>
    </section>
  );
};

export default LoginPage;
