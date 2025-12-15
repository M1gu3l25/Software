// src/olvido.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/olvido.css";

// Puedes centralizar esto en un archivo de config si quieres
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Ingresa un correo válido.");
      return;
    }

    try {
      setSending(true);

      const resp = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        // Si el backend devuelve mensaje de error, lo mostramos
        setError(
          data?.message ||
            data?.error ||
            "No pudimos enviar el correo. Inténtalo de nuevo."
        );
        setSent(false);
      } else {
        // Aunque el correo no exista, el backend responde ok=true por seguridad
        setSent(true);
      }
    } catch (err) {
      console.error("Error en forgot-password:", err);
      setError("Ocurrió un error al conectar con el servidor.");
      setSent(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="auth auth--center">
      <div
        className="auth__card"
        role="dialog"
        aria-labelledby="fp-title"
        aria-modal="true"
      >
        <div className="auth__header">
          <div className="auth__lottie sm">
            <lottie-player
              src={
                sent
                  ? "/iconosAnimados/Success.json"
                  : "/iconosAnimados/olvidar.json"
              }
              background="transparent"
              speed="1"
              loop={!sent}
              autoplay
              style={{ width: 140, height: 140 }}
            />
          </div>
          <h1 id="fp-title" className="auth__title">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="auth__subtitle">
            {sent
              ? "Te enviamos un enlace para restablecerla."
              : "Ingresa tu correo y te enviaremos un enlace para restablecerla."}
          </p>
        </div>

        {!sent ? (
          <form className="form" onSubmit={onSubmit} noValidate>
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              aria-describedby={error ? "email-err" : undefined}
              required
            />
            {error && (
              <p className="form-error" id="email-err" role="alert">
                {error}
              </p>
            )}

            <button
              className="btn-primary full"
              type="submit"
              disabled={sending}
            >
              {sending ? "Enviando..." : "Enviar enlace"}
            </button>

            <div className="auth__row center" style={{ marginTop: 10 }}>
              <Link className="link" to="/login">
                Volver a iniciar sesión
              </Link>
            </div>
          </form>
        ) : (
          <div className="success-state">
            <div className="tip muted">
              Si no ves el correo, revisa tu carpeta de spam o promociones.
            </div>
            <div className="actions">
              <Link className="btn-outline" to="/login">
                Volver al login
              </Link>
              <button
                className="btn-primary"
                onClick={() => {
                  setSent(false);
                  setEmail("");
                  setError(null);
                }}
              >
                Enviar a otro correo
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="auth__footer">
        © {new Date().getFullYear()} AnNutrition · Todos los derechos
        reservados
      </footer>
    </section>
  );
};

export default ForgotPasswordPage;
