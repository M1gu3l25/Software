// src/crearCuenta.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles/crearCuenta.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const SignupPage: React.FC = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const navigate = useNavigate();

  const strength = getStrength(pwd);
  const pwdMatch = pwd && pwd2 && pwd === pwd2;

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!name.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }

    if (!pwd || !pwd2) {
      setError("Debes ingresar y confirmar tu contraseña.");
      return;
    }

    if (!pwdMatch) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (!agree) {
      setError("Debes aceptar los Términos y Condiciones.");
      return;
    }

    try {
      setSubmitting(true);

      const resp = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: name,
          email,
          password: pwd,
        }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok || data.ok === false) {
        setError(
          data?.message ||
            data?.error ||
            "No se pudo crear la cuenta. Inténtalo de nuevo."
        );
        return;
      }

      // data: { ok, message, user, token }
      if (data.token && data.user) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      setSuccessMsg("Cuenta creada correctamente. Redirigiendo...");
      // Pequeño delay para que el usuario vea el mensaje
      setTimeout(() => {
        navigate("/principal"); // nuevos usuarios van al panel de usuarios
      }, 900);
    } catch (err) {
      console.error("Error en registro:", err);
      setError("Ocurrió un error al conectar con el servidor.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth auth--center">
      <div
        className="auth__card"
        role="dialog"
        aria-labelledby="su-title"
        aria-modal="true"
      >
        {/* ===== HEADER ===== */}
        <div className="auth__header" style={{ textAlign: "center" }}>
          <div className="auth__lottie sm">
            <lottie-player
              src="/iconosAnimados/crearCuenta.json"
              background="transparent"
              speed="1"
              loop
              autoplay
              style={{ width: 140, height: 140 }}
            />
          </div>
          <h1 id="su-title" className="auth__title">
            Crear cuenta
          </h1>
          <p className="auth__subtitle">
            Regístrate para administrar tu experiencia en AnNutrition
          </p>
        </div>

        {/* ===== FORMULARIO ===== */}
        <form className="form" onSubmit={onSubmit} noValidate>
          <label>Nombre completo</label>
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* ===== CONTRASEÑA ===== */}
          <label>Contraseña</label>
          <div className="input-with-action">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="********"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
            />
            <button
              type="button"
              className="chip-action"
              onClick={() => setShowPwd((v) => !v)}
              aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              title={showPwd ? "Ocultar" : "Mostrar"}
            >
              {showPwd ? (
                // Ojo cerrado
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="#0589c8"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M3 3l18 18" stroke="#0589c8" strokeWidth="2" />
                </svg>
              ) : (
                // Ojo abierto
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="#0589c8"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Medidor de seguridad */}
          <div className="pwd-meter" aria-hidden={!pwd}>
            <div
              className={`pwd-meter__bar lvl-${strength.level}`}
              style={{ width: `${strength.percent}%` }}
            />
            <span className={`pwd-meter__label lvl-${strength.level}`}>
              {strength.label}
            </span>
          </div>

          {/* ===== CONFIRMAR CONTRASEÑA ===== */}
          <label>Confirmar contraseña</label>
          <div className="input-with-action">
            <input
              type={showPwd2 ? "text" : "password"}
              placeholder="********"
              value={pwd2}
              onChange={(e) => setPwd2(e.target.value)}
              required
            />
            <button
              type="button"
              className="chip-action"
              onClick={() => setShowPwd2((v) => !v)}
              aria-label={
                showPwd2 ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              title={showPwd2 ? "Ocultar" : "Mostrar"}
            >
              {showPwd2 ? (
                // Ojo cerrado
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="#0589c8"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                  <path d="M3 3l18 18" stroke="#0589c8" strokeWidth="2" />
                </svg>
              ) : (
                // Ojo abierto
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  fill="#0589c8"
                  viewBox="0 0 24 24"
                >
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mensaje si no coinciden */}
          {pwd && pwd2 && !pwdMatch && (
            <p className="form-error" role="alert">
              Las contraseñas no coinciden.
            </p>
          )}

          {/* ===== TÉRMINOS ===== */}
          <div className="auth__row" style={{ marginTop: 10 }}>
            <label className="chk">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                Acepto los{" "}
                <Link className="link" to="/terminos">
                  Términos y Condiciones
                </Link>
              </span>
            </label>
          </div>

          {/* Mensajes de error / éxito */}
          {error && (
            <p className="form-error" role="alert" style={{ marginTop: 8 }}>
              {error}
            </p>
          )}
          {successMsg && (
            <p className="form-success" style={{ marginTop: 8 }}>
              {successMsg}
            </p>
          )}

          {/* ===== BOTÓN ===== */}
          <button
            className="btn-primary full"
            type="submit"
            disabled={!agree || submitting}
          >
            {submitting ? "Creando..." : "Crear cuenta"}
          </button>

          <p className="muted center small" style={{ marginTop: 12 }}>
            ¿Ya tienes cuenta?{" "}
            <Link className="link" to="/login">
              Inicia sesión
            </Link>
          </p>
        </form>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="auth__footer">
        © {new Date().getFullYear()} AnNutrition · Todos los derechos
        reservados
      </footer>
    </section>
  );
};

export default SignupPage;

/* ===== util simple de fuerza ===== */
function getStrength(pwd: string) {
  if (!pwd) return { level: 0, percent: 0, label: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const percent = Math.min(100, (score / 5) * 100);
  const level = score <= 2 ? 1 : score === 3 ? 2 : 3;
  const label = score <= 2 ? "Débil" : score === 3 ? "Media" : "Fuerte";
  return { level, percent, label };
}
