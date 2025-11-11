import { useState } from "react";
import "./styles/olvido.css";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Ingresa un correo válido.");
      return;
    }
    // Simulación UI
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      // setError("No pudimos enviar el correo. Inténtalo de nuevo."); // ejemplo de error
    }, 1200);
  };

  return (
    <section className="auth auth--center">
      <div className="auth__card" role="dialog" aria-labelledby="fp-title" aria-modal="true">
        <div className="auth__header">
          <div className="auth__lottie sm">
            <lottie-player
              src={sent ? "/iconosAnimados/Success.json" : "/iconosAnimados/olvidar.json"}
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

            <button className="btn-primary full" type="submit" disabled={sending}>
              {sending ? "Enviando..." : "Enviar enlace"}
            </button>

            <div className="auth__row center" style={{ marginTop: 10 }}>
              <a className="link" href="#/login">Volver a iniciar sesión</a>
            </div>
          </form>
        ) : (
          <div className="success-state">
            <div className="tip muted">
              Si no ves el correo, revisa tu carpeta de spam o promociones.
            </div>
            <div className="actions">
              <a className="btn-outline" href="#/login">Volver al login</a>
              <button className="btn-primary" onClick={() => { setSent(false); setEmail(""); }}>
                Enviar a otro correo
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="auth__footer">
        © {new Date().getFullYear()} AnNutrition · Todos los derechos reservados
      </footer>
    </section>
  );
};

export default ForgotPasswordPage;
