import "./styles/style.css";
import logoManzana from "./assets/images/manzana.png";
import heroImg from "./assets/images/definicion-de-nutricion-y-dietetica.jpg";
import equipoImg from "./assets/images/AnNutricion (2).jpeg";
import asesor1 from "./assets/images/usuario2.jpeg";
import asesor2 from "./assets/images/usuario1.jpeg";
import mat1 from "./assets/images/nutricionBasica.jpg";
import mat2 from "./assets/images/recetasSaludables.png";
import mat3 from "./assets/images/manejoDiabete.jpg";
import mat4 from "./assets/images/leer.jpg";
import mat5 from "./assets/images/dieta-sana-durante-el-embarazo.jpg";
import mat6 from "./assets/images/nutricionDeportiva.png";
import facebookIcon from "./assets/images/facebook.png";
import instagramIcon from "./assets/images/logotipo-de-instagram.png";

const year = new Date().getFullYear();

const AnNutritionPage: React.FC = () => {

  return (
    <div lang="es">
      {/* ===== NAV ===== */}
      <nav className="nav">
        <div className="nav__logo">
          <img src={logoManzana} alt="Logo AnNutrition" className="nav__icon" />
          <span>AnNutrition</span>
        </div>
        <ul className="nav__menu">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#quienes">¿Quiénes somos?</a></li>
          <li><a href="#asesores">Asesores</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#material">Material Educativo</a></li>
          <li><a href="#testimonios">Opiniones</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <button className="btn-primary" type="button">Iniciar sesión</button>
      </nav>

      {/* ===== HERO ===== */}
      <section id="inicio" className="hero">
        <div className="hero__text">
          <p className="hero__subtitle">Tu camino hacia una vida más saludable</p>
          <h1>
            Transformamos vidas a través de la nutrición personalizada y el
            acompañamiento profesional
          </h1>
          <div className="hero__buttons">
            <button className="btn-primary" type="button">Agenda tu consulta</button>
            <button className="btn-outline" type="button">Conoce más</button>
          </div>
          <div className="hero__stats">
            <div>
              <strong>500+</strong>
              <p>Pacientes atendidos</p>
            </div>
            <div>
              <strong>4+</strong>
              <p>Años de experiencia</p>
            </div>
            <div>
              <strong>95%</strong>
              <p>Satisfacción</p>
            </div>
          </div>
        </div>
        <div className="hero__image">
          <img src={heroImg} alt="Frutas saludables" />
        </div>
      </section>

      {/* ===== QUIÉNES SOMOS ===== */}
      <section id="quienes" className="about">
        <div className="about__grid">
          <figure className="about__photo">
            <img src={equipoImg} alt="Equipo AnNutrition" />
          </figure>

          <div className="about__panel">
            <h2 className="about__title">¿Quiénes somos?</h2>
            <p className="about__lead">
              Somos un equipo de profesionales apasionados por la nutrición y el bienestar integral
            </p>

            <ul className="about__list">
              <li className="about__item">
                <span className="badge">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2a10 10 0 1010 10A10.012 10.012 0 0012 2zm0 16a6 6 0 116-6 6.006 6.006 0 01-6 6zm0-8a2 2 0 102 2 2 2 0 00-2-2z"/>
                  </svg>
                </span>
                <div>
                  <h3>Nuestra Misión</h3>
                  <p>
                    Mejorar la calidad de vida de nuestros pacientes mediante planes nutricionales
                    personalizados y basados en evidencia científica.
                  </p>
                </div>
              </li>

              <li className="about__item">
                <span className="badge">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M3 3h2v18H3zM9 10h2v11H9zM15 6h2v15h-2zM21 13h2v8h-2z"/>
                  </svg>
                </span>
                <div>
                  <h3>Nuestra Visión</h3>
                  <p>
                    Ser el centro de nutrición líder en México, reconocido por la excelencia en nuestros
                    servicios y resultados transformadores.
                  </p>
                </div>
              </li>

              <li className="about__item">
                <span className="badge">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2l8 3v6c0 6.08-4.28 11.29-8 12-3.72-.71-8-5.92-8-12V5z"/>
                  </svg>
                </span>
                <div>
                  <h3>Nuestros Valores</h3>
                  <p>
                    Compromiso, profesionalismo, empatía e innovación guían cada una de nuestras acciones.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Destacados */}
        <div className="about__highlights">
          <article className="feature">
            <div className="feature__icon">
              <lottie-player
                src="/iconosAnimados/equipoExperto.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: 72, height: 72 }}
              />
            </div>
            <h4>Equipo Experto</h4>
            <p>Nutricionistas certificados</p>
          </article>

          <article className="feature">
            <div className="feature__icon">
              <lottie-player
                src="/iconosAnimados/consultaPersonalizada.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: 72, height: 72 }}
              />
            </div>
            <h4>Atención Personalizada</h4>
            <p>Planes adaptados a ti</p>
          </article>

          <article className="feature">
            <div className="feature__icon">
              <lottie-player
                src="/iconosAnimados/resultadosComprobados.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: 72, height: 72 }}
              />
            </div>
            <h4>Resultados Comprobados</h4>
            <p>95% de éxito</p>
          </article>

          <article className="feature">
            <div className="feature__icon">
              <lottie-player
                src="/iconosAnimados/confianzaTotal.json"
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: 72, height: 72 }}
              />
            </div>
            <h4>Confianza Total</h4>
            <p>Métodos científicos</p>
          </article>
        </div>
      </section>

      {/* ===== NUESTROS ASESORES ===== */}
      <section id="asesores" className="advisors">
        <h2 className="section-title">Nuestros Asesores</h2>
        <p className="section-subtitle">
          Conoce al equipo de expertos que te acompañará en tu transformación
        </p>
        <div className="cards cards--grid-2">
          <article className="card card--advisor">
            <img src={asesor1} alt="M.N.D. Alejandra Jocelyn Gómez Nava" />
            <div className="card__body">
              <h3 className="card__title">M.N.D. Alejandra Jocelyn Gómez Nava</h3>
              <a className="link">Nutrición Clínica</a>
              <p className="muted">7 años de experiencia</p>
              <button className="btn-outline full" type="button">Ver perfil completo</button>
            </div>
          </article>
          <article className="card card--advisor">
            <img src={asesor2} alt="M.N.D. Noé Toribio Trujillo" />
            <div className="card__body">
              <h3 className="card__title">M.N.D. Noé Toribio Trujillo</h3>
              <a className="link">Nutrición Clínica</a>
              <p className="muted">7 años de experiencia</p>
              <button className="btn-outline full" type="button">Ver perfil completo</button>
            </div>
          </article>
        </div>
      </section>

      {/* ===== NUESTROS SERVICIOS ===== */}
      <section id="servicios" className="services">
        <h2 className="section-title">Nuestros Servicios</h2>
        <p className="section-subtitle">Soluciones nutricionales integrales para cada necesidad</p>

        <div className="cards">
          <article className="card">
            <div className="card__icon badge--round">📅</div>
            <h3 className="card__title">Consulta Nutricional</h3>
            <p className="accent">Desde $500</p>
            <ul className="list-check">
              <li>Análisis de composición corporal</li>
              <li>Plan de alimentación personalizado</li>
              <li>Seguimiento mensual</li>
            </ul>
            <button className="btn-primary full" type="button">Más información</button>
          </article>

          <article className="card">
            <div className="card__icon badge--round">🎯</div>
            <h3 className="card__title">Pérdida de Peso</h3>
            <p className="accent">Desde $2,000/mes</p>
            <ul className="list-check">
              <li>Plan nutricional específico</li>
              <li>Seguimiento semanal</li>
              <li>Apoyo psicológico</li>
            </ul>
            <button className="btn-primary full" type="button">Más información</button>
          </article>

          <article className="card">
            <div className="card__icon badge--round">📈</div>
            <h3 className="card__title">Nutrición Deportiva</h3>
            <p className="accent">Desde $2,500/mes</p>
            <ul className="list-check">
              <li>Planes para atletas</li>
              <li>Suplementación personalizada</li>
              <li>Seguimiento continuo</li>
            </ul>
            <button className="btn-primary full" type="button">Más información</button>
          </article>
        </div>

        <div className="cards">
          <article className="card">
            <div className="card__icon badge--round">💙</div>
            <h3 className="card__title">Nutrición Clínica</h3>
            <p className="accent">Desde $600</p>
            <ul className="list-check">
              <li>Diabetes, hipertensión</li>
              <li>Enfermedades cardiovasculares</li>
              <li>Control especializado</li>
            </ul>
            <button className="btn-primary full" type="button">Más información</button>
          </article>

          <article className="card">
            <div className="card__icon badge--round">👨‍👩‍👧‍👦</div>
            <h3 className="card__title">Asesoría Familiar</h3>
            <p className="accent">Desde $3,000/mes</p>
            <ul className="list-check">
              <li>Consultas grupales</li>
              <li>Recetas saludables</li>
              <li>Talleres educativos</li>
            </ul>
            <button className="btn-primary full" type="button">Más información</button>
          </article>

          <article className="card">
            <div className="card__icon badge--round">📱</div>
            <h3 className="card__title">Nuestra Aplicación</h3>
            <p className="accent">Cotización</p>
            <ul className="list-check">
              <li>Material visual y gráfico</li>
              <li>Planes alimenticios</li>
              <li>Evaluaciones</li>
            </ul>
            <button className="btn-primary full" type="button">Más información</button>
          </article>
        </div>
      </section>

      {/* ===== MATERIAL EDUCATIVO ===== */}
      <section id="material" className="material">
        <h2 className="section-title">Material Educativo</h2>
        <p className="section-subtitle">Aprende más sobre nutrición y bienestar</p>

        {/* Fila 1 */}
        <div className="cards">
          <article className="card card--material">
            <img src={mat1} alt="Guía de Nutrición Básica" />
            <div className="card__body">
              <span className="muted small">📘 Guías</span>
              <h3 className="card__title">Guía de Nutrición Básica</h3>
              <p className="muted">Fundamentos de una alimentación saludable</p>
              <button className="btn-outline full" type="button">Más información</button>
            </div>
          </article>

          <article className="card card--material">
            <img src={mat2} alt="Recetas Saludables" />
            <div className="card__body">
              <span className="muted small">📗 Recetarios</span>
              <h3 className="card__title">Recetas Saludables</h3>
              <p className="muted">50 recetas nutritivas y deliciosas</p>
              <button className="btn-outline full" type="button">Más información</button>
            </div>
          </article>

          <article className="card card--material">
            <img src={mat3} alt="Manejo de la Diabetes" />
            <div className="card__body">
              <span className="muted small">📙 Artículos</span>
              <h3 className="card__title">Manejo de la Diabetes</h3>
              <p className="muted">Control nutricional de la diabetes</p>
              <button className="btn-outline full" type="button">Más información</button>
            </div>
          </article>
        </div>

        {/* Fila 2 (NUEVA) */}
        <div className="cards">
          <article className="card card--material">
            <img src={mat4} alt="Etiquetas Nutrimentales" />
            <div className="card__body">
              <span className="muted small">📘 Guías</span>
              <h3 className="card__title">Cómo leer etiquetas nutrimentales</h3>
              <p className="muted">Aprende a elegir mejores productos en el súper</p>
              <button className="btn-outline full" type="button">Más información</button>
            </div>
          </article>

          <article className="card card--material">
            <img src={mat5} alt="Alimentación en Embarazo" />
            <div className="card__body">
              <span className="muted small">📙 Artículos</span>
              <h3 className="card__title">Alimentación durante el embarazo</h3>
              <p className="muted">Recomendaciones y menú ejemplo por trimestre</p>
              <button className="btn-outline full" type="button">Más información</button>
            </div>
          </article>

          <article className="card card--material">
            <img src={mat6} alt="Nutrición Deportiva Inicial" />
            <div className="card__body">
              <span className="muted small">📗 Recetarios</span>
              <h3 className="card__title">Nutrición deportiva: Inicio</h3>
              <p className="muted">Snacks y pre/post-entreno fáciles</p>
              <button className="btn-outline full" type="button">Más información</button>
            </div>
          </article>
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section id="testimonios" className="testimonios">
        <h2 className="section-title">Lo que dicen nuestros pacientes</h2>
        <p className="section-subtitle">Historias reales de transformación</p>
        <div className="cards cards--grid-3">
          <article className="card card--testimonial">
            <div className="stars">★★★★★</div>
            <p>
              Excelente atención y resultados increíbles. Perdí 15kg de forma saludable y aprendí a comer mejor. ¡Totalmente recomendado!
            </p>
            <div className="person">
              <div className="avatar">LP</div>
              <div>
                <h4>Laura Pérez</h4>
                <span className="muted small">Paciente desde 2024</span>
              </div>
            </div>
          </article>

          <article className="card card--testimonial">
            <div className="stars">★★★★★</div>
            <p>
              El equipo es muy profesional y empático. Me ayudaron a controlar mi diabetes con un plan personalizado. Muy agradecido.
            </p>
            <div className="person">
              <div className="avatar">RS</div>
              <div>
                <h4>Roberto Sánchez</h4>
                <span className="muted small">Paciente desde 2023</span>
              </div>
            </div>
          </article>

          <article className="card card--testimonial">
            <div className="stars">★★★★★</div>
            <p>
              Como deportista, necesitaba un plan específico. Los resultados en mi rendimiento han sido notables. ¡Gracias!
            </p>
            <div className="person">
              <div className="avatar">CF</div>
              <div>
                <h4>Carmen Flores</h4>
                <span className="muted small">Paciente desde 2024</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="contacto">
        <h2 className="section-title">Contáctanos</h2>
        <p className="section-subtitle">Estamos aquí para ayudarte a comenzar tu transformación</p>

        <div className="contacto__grid">
          {/* ===== FORMULARIO ===== */}
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <label>Nombre completo</label>
            <input type="text" placeholder="Tu nombre" />
            <label>Correo electrónico</label>
            <input type="email" placeholder="tu@email.com" />
            <label>Teléfono</label>
            <input type="tel" placeholder="(555) 123-4567" />
            <label>Mensaje</label>
            <textarea rows={5} placeholder="¿En qué podemos ayudarte?" />
            <button className="btn-primary" type="submit">Enviar mensaje</button>
          </form>

          {/* ===== INFORMACIÓN DE CONTACTO ===== */}
          <div className="contacto__info">
            <div className="info-box">
              <div className="info-ico">📍</div>
              <div>
                <h4>Ubicación</h4>
                <p className="muted">
                  Avenida 30 de Abril #64, Colonia Centro, Buenavista de Cuéllar 40330
                </p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-ico">📞</div>
              <div>
                <h4>Teléfono</h4>
                <p className="muted">
                  (555) 123-4567
                  <br />
                  (555) 765-4321
                </p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-ico">✉️</div>
              <div>
                <h4>Email</h4>
                <p className="muted">
                  contacto@nutrisystem.com
                  <br />
                  citas@nutrisystem.com
                </p>
              </div>
            </div>

            {/* ===== NUEVO BLOQUE HORARIO ===== */}
            <div className="info-box">
              <div className="info-ico">⏰</div>
              <div>
                <h4>Horario</h4>
                <p className="muted">
                  Lunes a Viernes: 9:00 AM - 6:00 PM
                  <br />
                  Sábados: 9:00 AM - 2:00 PM
                  <br />
                  Domingos: Cerrado
                </p>
              </div>
            </div>

            {/* ===== NUEVO MAPA ===== */}
            <div className="mapa-box">
              <div className="mapa-placeholder">
                <div className="mapa-icon">📍</div>
                <p>Mapa de ubicación</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer__grid">
          <div>
            <div className="brand">
              <img src={logoManzana} alt="AnNutrition" className="nav__icon" />
              <strong>AnNutrition</strong>
            </div>
            <p className="muted">Planes nutricionales personalizados.</p>
          </div>
          <div>
            <h4>Secciones</h4>
            <ul className="footer__links">
              <li><a href="#inicio">Inicio</a></li>
              <li><a href="#quienes">¿Quiénes somos?</a></li>
              <li><a href="#servicios">Servicios</a></li>
              <li><a href="#material">Material</a></li>
              <li><a href="#contacto">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul className="footer__links">
              <li>
                <a href="mailto:contacto@nutrisystem.com">contacto@nutrisystem.com</a>
              </li>
              <li>
                <a href="tel:+525551234567">(555) 123-4567</a>
              </li>
            </ul>
            <div className="social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <img src={instagramIcon} alt="Instagram" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer__bar">© {year} AnNutrition. Todos los derechos reservados.</div>
      </footer>
    </div>
  );
};

export default AnNutritionPage;
