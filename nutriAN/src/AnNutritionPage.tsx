// src/AnNutritionPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/stylePage.css";
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

// URL base del backend
const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:4000/api";

const materialImages = [mat1, mat2, mat3, mat4, mat5, mat6];

/** ==== TIPOS ====  */
type MaterialInfo = {
  categoria: string;
  emoji: string;
  titulo: string;
  descripcion: string;
  resumen?: string;
  puntos?: string[];
  publico?: string[];
};

type MaterialItem = {
  id: number;
  categoria: string;
  emoji_categoria: string;
  titulo: string;
  descripcion: string;
};

type Servicio = {
  id: number;
  titulo: string;
  precio_texto: string;
  punto1?: string | null;
  punto2?: string | null;
  punto3?: string | null;
  icono_tipo: "emoji" | "imagen";
  icono_emoji: string | null;
  icono_imagen?: string | null;
  orden: number;
  activo: number;
};

type Testimonial = {
  id: number;
  nombre: string;
  iniciales: string;
  desde: string;
  comentario: string;
  calificacion: number;
};

const AnNutritionPage: React.FC = () => {
  const navigate = useNavigate();

  // ====== HELPER PARA BLOQUEAR ACCIONES SI NO HAY LOGIN ======
  const showLoginMessage = () => {
    alert("Por favor inicie sesión");
  };

  const handleBlockedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showLoginMessage();
  };

  // ====== ESTADO PARA EL PANEL "AGENDAR CONSULTA" (modal no se abre en visitante) ======
  const [openConsulta] = useState(false);
  const [consultaForm, setConsultaForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    fecha: "",
    mensaje: "",
  });

  // ====== ESTADO PARA EL PANEL DE "MATERIAL EDUCATIVO" (solo visual, no se abre) ======
  const [openMaterial] = useState(false);
  const [materialSeleccionado] = useState<MaterialInfo | null>(null);

  // ====== ESTADO PARA TESTIMONIOS (USUARIOS) ======
  const [testimonios, setTestimonios] = useState<Testimonial[]>([]);

  const [nuevoTestimonio, setNuevoTestimonio] = useState({
    nombre: "",
    desde: `${year}`,
    comentario: "",
    calificacion: 5,
  });

  // ====== ESTADO SERVICIOS (DINÁMICO) ======
  const [services, setServices] = useState<Servicio[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);

  // ====== ESTADO MATERIAL EDUCATIVO (DINÁMICO) ======
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialsError, setMaterialsError] = useState<string | null>(null);

  // ====== ESTADO CONTACTO ======
  const [contactoForm, setContactoForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });

  // ====== ESTADO CARRUSEL (SERVICIOS / MATERIAL) ======
  const [servicePage, setServicePage] = useState(0);
  const [materialPage, setMaterialPage] = useState(0);
  const [servicesPerPage, setServicesPerPage] = useState(3);
  const [materialsPerPage, setMaterialsPerPage] = useState(3);

  // ====== CARGAS INICIALES (solo GET, son visuales) ======
  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const resp = await fetch(`${API_BASE}/comentarios`);
        if (!resp.ok) {
          console.error("Error al obtener comentarios:", resp.status);
          return;
        }

        const data = await resp.json();

        const adaptados: Testimonial[] = data.map((item: any) => ({
          id: item.id,
          nombre: item.nombre,
          iniciales:
            item.nombre
              ?.split(" ")
              .filter((p: string) => p.length > 0)
              .slice(0, 2)
              .map((p: string) => p[0].toUpperCase())
              .join("") || "US",
          desde: item.paciente_desde?.toString() || `${year}`,
          comentario: item.comentario,
          calificacion: item.calificacion || 5,
        }));

        setTestimonios(adaptados);
      } catch (error) {
        console.error(
          "Error al conectar con el backend (cargar comentarios):",
          error
        );
      }
    };

    const loadServices = async () => {
      try {
        setLoadingServices(true);
        setServicesError(null);
        const resp = await fetch(`${API_BASE}/servicios?activos=1`);
        if (!resp.ok) {
          throw new Error("No se pudieron cargar los servicios.");
        }
        const data = await resp.json();
        const adaptados: Servicio[] = data.map((item: any) => ({
          id: item.id,
          titulo: item.titulo,
          precio_texto: item.precio_texto,
          punto1: item.punto1,
          punto2: item.punto2,
          punto3: item.punto3,
          icono_tipo: item.icono_tipo === "imagen" ? "imagen" : "emoji",
          icono_emoji: item.icono_emoji ?? "📅",
          icono_imagen: item.icono_imagen,
          orden: item.orden ?? 1,
          activo: item.activo ?? 1,
        }));
        setServices(adaptados);
      } catch (err: any) {
        console.error("Error al cargar servicios:", err);
        setServicesError(
          err?.message || "Error al cargar servicios desde el servidor."
        );
      } finally {
        setLoadingServices(false);
      }
    };

    const loadMaterials = async () => {
      try {
        setLoadingMaterials(true);
        setMaterialsError(null);
        const resp = await fetch(`${API_BASE}/material`);
        if (!resp.ok) {
          throw new Error("No se pudo cargar el material educativo.");
        }
        const data = await resp.json();
        const adaptados: MaterialItem[] = data.map((item: any) => ({
          id: item.id,
          categoria: item.categoria,
          emoji_categoria: item.emoji_categoria ?? "📘",
          titulo: item.titulo,
          descripcion: item.descripcion,
        }));
        setMaterials(adaptados);
      } catch (err: any) {
        console.error("Error al cargar material educativo:", err);
        setMaterialsError(
          err?.message ||
            "Error al cargar el material educativo desde el servidor."
        );
      } finally {
        setLoadingMaterials(false);
      }
    };

    cargarComentarios();
    void loadServices();
    void loadMaterials();
  }, []);

  // ====== RESPONSIVE: CUÁNTAS TARJETAS POR PÁGINA (DESKTOP 3, MÓVIL 1) ======
  useEffect(() => {
    const updatePerPage = () => {
      if (window.innerWidth < 768) {
        setServicesPerPage(1);
        setMaterialsPerPage(1);
      } else {
        setServicesPerPage(3);
        setMaterialsPerPage(3);
      }
    };

    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  // Si cambian los datos o el tamaño, regresamos a la primera página
  useEffect(() => {
    setServicePage(0);
  }, [services.length, servicesPerPage]);

  useEffect(() => {
    setMaterialPage(0);
  }, [materials.length, materialsPerPage]);

  // ====== HANDLERS (SOLO PARA CONTROLAR INPUTS, SIN ENVIAR NADA) ======
  const handleConsultaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConsultaForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestimonioChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNuevoTestimonio((prev) => ({
      ...prev,
      [name]: name === "calificacion" ? Number(value) : value,
    }));
  };

  const handleContactoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====== DERIVADOS DEL CARRUSEL ======
  const totalServicePages =
    services.length > 0 ? Math.ceil(services.length / servicesPerPage) : 1;
  const totalMaterialPages =
    materials.length > 0 ? Math.ceil(materials.length / materialsPerPage) : 1;

  const serviceStart = servicePage * servicesPerPage;
  const serviceEnd = serviceStart + servicesPerPage;
  const servicesToShow = services.slice(serviceStart, serviceEnd);

  const materialStart = materialPage * materialsPerPage;
  const materialEnd = materialStart + materialsPerPage;
  const materialsToShow = materials.slice(materialStart, materialEnd);

  return (
    <div lang="es">
      {/* ===== NAV ===== */}
      <nav className="nav">
        <div className="nav__logo">
          <img src={logoManzana} alt="Logo AnNutrition" className="nav__icon" />
          <span>AnNutrition</span>
        </div>
        <ul className="nav__menu">
          <li>
            <a href="#inicio">Inicio</a>
          </li>
          <li>
            <a href="#quienes">¿Quiénes somos?</a>
          </li>
          <li>
            <a href="#asesores">Asesores</a>
          </li>
          <li>
            <a href="#servicios">Servicios</a>
          </li>
          <li>
            <a href="#material">Material Educativo</a>
          </li>
          <li>
            <a href="#testimonios">Opiniones</a>
          </li>
          <li>
            <a href="#contacto">Contacto</a>
          </li>
        </ul>
        <button
          className="btn-primary"
          type="button"
          onClick={() => navigate("/login")}
        >
          Iniciar sesión
        </button>
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
            <button
              className="btn-primary"
              type="button"
              onClick={showLoginMessage}
            >
              Agenda tu consulta
            </button>
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

      {/* ===== MODAL / PANEL DE AGENDAR CONSULTA (no se abre en visitante) ===== */}
      {openConsulta && (
        <div className="consulta-overlay">
          <div className="consulta-modal">
            <h2 className="consulta-title">Agendar consulta</h2>
            <p className="consulta-subtitle">
              Completa tus datos y nos pondremos en contacto para confirmar tu
              cita.
            </p>

            <form className="consulta-form" onSubmit={handleBlockedSubmit}>
              <label>
                Nombre completo
                <input
                  type="text"
                  name="nombre"
                  value={consultaForm.nombre}
                  onChange={handleConsultaChange}
                  required
                />
              </label>

              <label>
                Correo electrónico
                <input
                  type="email"
                  name="correo"
                  value={consultaForm.correo}
                  onChange={handleConsultaChange}
                  required
                />
              </label>

              <label>
                Teléfono
                <input
                  type="tel"
                  name="telefono"
                  value={consultaForm.telefono}
                  onChange={handleConsultaChange}
                  required
                />
              </label>

              <label>
                Fecha preferida de consulta
                <input
                  type="date"
                  name="fecha"
                  value={consultaForm.fecha}
                  onChange={handleConsultaChange}
                  required
                />
              </label>

              <label>
                Mensaje (opcional)
                <textarea
                  name="mensaje"
                  rows={3}
                  value={consultaForm.mensaje}
                  onChange={handleConsultaChange}
                  placeholder="Cuéntanos brevemente qué necesitas…"
                />
              </label>

              <button type="submit" className="btn-primary consulta-submit">
                Confirmar cita
              </button>
              <button
                type="button"
                className="consulta-close"
                onClick={showLoginMessage}
              >
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== QUIÉNES SOMOS ===== */}
      <section id="quienes" className="about">
        <div className="about__grid">
          <figure className="about__photo">
            <img src={equipoImg} alt="Equipo AnNutrition" />
          </figure>

          <div className="about__panel">
            <h2 className="about__title">¿Quiénes somos?</h2>
            <p className="about__lead">
              Somos un equipo de profesionales apasionados por la nutrición y el
              bienestar integral
            </p>

            <ul className="about__list">
              <li className="about__item">
                <span className="badge">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2a10 10 0 1010 10A10.012 10.012 0 0012 2zm0 16a6 6 0 116-6 6.006 6.006 0 01-6 6zm0-8a2 2 0 102 2 2 2 0 00-2-2z" />
                  </svg>
                </span>
                <div>
                  <h3>Nuestra Misión</h3>
                  <p>
                    Mejorar la calidad de vida de nuestros pacientes mediante
                    planes nutricionales personalizados y basados en evidencia
                    científica.
                  </p>
                </div>
              </li>

              <li className="about__item">
                <span className="badge">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M3 3h2v18H3zM9 10h2v11H9zM15 6h2v15h-2zM21 13h2v8h-2z" />
                  </svg>
                </span>
                <div>
                  <h3>Nuestra Visión</h3>
                  <p>
                    Ser el centro de nutrición líder en México, reconocido por
                    la excelencia en nuestros servicios y resultados
                    transformadores.
                  </p>
                </div>
              </li>

              <li className="about__item">
                <span className="badge">
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d="M12 2l8 3v6c0 6.08-4.28 11.29-8 12-3.72-.71-8-5.92-8-12V5z" />
                  </svg>
                </span>
                <div>
                  <h3>Nuestros Valores</h3>
                  <p>
                    Compromiso, profesionalismo, empatía e innovación guían cada
                    una de nuestras acciones.
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
              <h3 className="card__title">
                M.N.D. Alejandra Jocelyn Gómez Nava
              </h3>
              <a className="link">Nutrición Clínica</a>
              <p className="muted">7 años de experiencia</p>
              <button
                className="btn-outline full"
                type="button"
                onClick={showLoginMessage}
              >
                Ver perfil completo
              </button>
            </div>
          </article>
          <article className="card card--advisor">
            <img src={asesor2} alt="M.N.D. Noé Toribio Trujillo" />
            <div className="card__body">
              <h3 className="card__title">M.N.D. Noé Toribio Trujillo</h3>
              <a className="link">Nutrición Clínica</a>
              <p className="muted">7 años de experiencia</p>
              <button
                className="btn-outline full"
                type="button"
                onClick={showLoginMessage}
              >
                Ver perfil completo
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* ===== NUESTROS SERVICIOS (DINÁMICO + CARRUSEL) ===== */}
      <section id="servicios" className="services">
        <h2 className="section-title">Nuestros Servicios</h2>
        <p className="section-subtitle">
          Soluciones nutricionales integrales para cada necesidad
        </p>

        <div className="carousel-section">
          {loadingServices && <p className="muted">Cargando servicios…</p>}
          {servicesError && <p className="error">{servicesError}</p>}
          {!loadingServices && !servicesError && services.length === 0 && (
            <p className="muted">
              Pronto añadiremos nuestros servicios en esta sección.
            </p>
          )}

          {!loadingServices && !servicesError && services.length > 0 && (
            <>
              <div className="cards carousel-cards">
                {servicesToShow.map((srv) => (
                  <article className="card" key={srv.id}>
                    <div className="card__icon badge--round">
                      {srv.icono_tipo === "emoji"
                        ? srv.icono_emoji || "📅"
                        : "🖼"}
                    </div>
                    <h3 className="card__title">{srv.titulo}</h3>
                    <p className="accent">{srv.precio_texto}</p>
                    <ul className="list-check">
                      {srv.punto1 && <li>{srv.punto1}</li>}
                      {srv.punto2 && <li>{srv.punto2}</li>}
                      {srv.punto3 && <li>{srv.punto3}</li>}
                    </ul>
                    <button
                      className="btn-primary full"
                      type="button"
                      onClick={showLoginMessage}
                    >
                      Más información
                    </button>
                  </article>
                ))}
              </div>

              {totalServicePages > 1 && (
                <div className="carousel-controls">
                  <div className="carousel-arrows">
                    <button
                      type="button"
                      className="carousel-btn"
                      onClick={() =>
                        setServicePage((prev) =>
                          prev === 0 ? prev : prev - 1
                        )
                      }
                      disabled={servicePage === 0}
                      aria-label="Servicios anteriores"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="carousel-btn"
                      onClick={() =>
                        setServicePage((prev) =>
                          prev === totalServicePages - 1 ? prev : prev + 1
                        )
                      }
                      disabled={servicePage === totalServicePages - 1}
                      aria-label="Servicios siguientes"
                    >
                      ›
                    </button>
                  </div>

                  <div className="carousel-dots">
                    {Array.from({ length: totalServicePages }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={
                          "carousel-dot" +
                          (idx === servicePage ? " carousel-dot--active" : "")
                        }
                        onClick={() => setServicePage(idx)}
                        aria-label={`Ir a página ${idx + 1} de servicios`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== MATERIAL EDUCATIVO (DINÁMICO + CARRUSEL) ===== */}
      <section id="material" className="material">
        <h2 className="section-title">Material Educativo</h2>
        <p className="section-subtitle">
          Aprende más sobre nutrición y bienestar
        </p>

        <div className="carousel-section">
          {loadingMaterials && <p className="muted">Cargando material…</p>}
          {materialsError && <p className="error">{materialsError}</p>}
          {!loadingMaterials && !materialsError && materials.length === 0 && (
            <p className="muted">
              Pronto añadiremos material educativo en esta sección.
            </p>
          )}

          {!loadingMaterials && !materialsError && materials.length > 0 && (
            <>
              <div className="cards carousel-cards">
                {materialsToShow.map((mat, index) => {
                  const imgSrc =
                    materialImages[index % materialImages.length] ||
                    materialImages[0];

                  const textoCorto =
                    mat.descripcion && mat.descripcion.length > 140
                      ? mat.descripcion.slice(0, 137) + "..."
                      : mat.descripcion;

                  return (
                    <article
                      className="card card--material"
                      key={mat.id ?? `${mat.titulo}-${index}`}
                    >
                      <img src={imgSrc} alt={mat.titulo} />
                      <div className="card__body">
                        <span className="muted small">
                          {mat.emoji_categoria} {mat.categoria}
                        </span>
                        <h3 className="card__title">{mat.titulo}</h3>
                        <p className="muted">{textoCorto}</p>
                        <button
                          className="btn-outline full"
                          type="button"
                          onClick={showLoginMessage}
                        >
                          Más información
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              {totalMaterialPages > 1 && (
                <div className="carousel-controls">
                  <div className="carousel-arrows">
                    <button
                      type="button"
                      className="carousel-btn"
                      onClick={() =>
                        setMaterialPage((prev) =>
                          prev === 0 ? prev : prev - 1
                        )
                      }
                      disabled={materialPage === 0}
                      aria-label="Material anterior"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="carousel-btn"
                      onClick={() =>
                        setMaterialPage((prev) =>
                          prev === totalMaterialPages - 1 ? prev : prev + 1
                        )
                      }
                      disabled={materialPage === totalMaterialPages - 1}
                      aria-label="Material siguiente"
                    >
                      ›
                    </button>
                  </div>

                  <div className="carousel-dots">
                    {Array.from({ length: totalMaterialPages }).map(
                      (_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={
                            "carousel-dot" +
                            (idx === materialPage
                              ? " carousel-dot--active"
                              : "")
                          }
                          onClick={() => setMaterialPage(idx)}
                          aria-label={`Ir a página ${idx + 1} de material`}
                        />
                      )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ===== PANEL / MODAL PARA MATERIAL EDUCATIVO (no se abre en visitante) ===== */}
      {openMaterial && materialSeleccionado && (
        <div className="consulta-overlay">
          <div className="consulta-modal material-modal">
            <header className="material-modal__header material-modal__header--simple">
              <span className="material-panel-chip">
                <span className="material-panel-chip-emoji">
                  {materialSeleccionado.emoji}
                </span>
                <span>{materialSeleccionado.categoria}</span>
              </span>

              <h2 className="consulta-title material-modal__title">
                {materialSeleccionado.titulo}
              </h2>
            </header>

            <p className="material-panel-description material-panel-description--large">
              {materialSeleccionado.descripcion}
            </p>

            <button
              type="button"
              className="consulta-close material-modal__close"
              onClick={showLoginMessage}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* ===== TESTIMONIOS ===== */}
      <section id="testimonios" className="testimonios">
        <h2 className="section-title">Lo que dicen nuestros pacientes</h2>
        <p className="section-subtitle">Historias reales de transformación</p>

        {/* FORMULARIO PARA QUE EL USUARIO AGREGUE SU OPINIÓN (bloqueado) */}
        <div className="testimonial-form-wrapper">
          <form className="testimonial-form" onSubmit={handleBlockedSubmit}>
            <h3>Comparte tu experiencia</h3>
            <p className="muted small">
              Tu opinión ayuda a otras personas a animarse a cuidar su salud.
            </p>

            <div className="testimonial-form__grid">
              <label>
                Nombre
                <input
                  type="text"
                  name="nombre"
                  value={nuevoTestimonio.nombre}
                  onChange={handleTestimonioChange}
                  placeholder="Tu nombre"
                  required
                />
              </label>

              <label>
                Paciente desde
                <input
                  type="number"
                  name="desde"
                  min={2000}
                  max={year}
                  value={nuevoTestimonio.desde}
                  onChange={handleTestimonioChange}
                />
              </label>

              <label>
                Calificación
                <select
                  name="calificacion"
                  value={nuevoTestimonio.calificacion}
                  onChange={handleTestimonioChange}
                >
                  <option value={5}>★★★★★ (5)</option>
                  <option value={4}>★★★★☆ (4)</option>
                  <option value={3}>★★★☆☆ (3)</option>
                  <option value={2}>★★☆☆☆ (2)</option>
                  <option value={1}>★☆☆☆☆ (1)</option>
                </select>
              </label>
            </div>

            <label>
              Comentario
              <textarea
                name="comentario"
                rows={3}
                placeholder="Cuéntanos brevemente tu experiencia con AnNutrition…"
                value={nuevoTestimonio.comentario}
                onChange={handleTestimonioChange}
                required
              />
            </label>

            <button type="submit" className="btn-primary">
              Enviar comentario
            </button>
          </form>
        </div>

        {/* LISTA DE TESTIMONIOS (visual) */}
        <div className="cards cards--grid-3">
          {testimonios.map((t) => (
            <article key={t.id} className="card card--testimonial">
              <div className="stars">
                {"★".repeat(t.calificacion)}
                {"☆".repeat(5 - t.calificacion)}
              </div>
              <p>{t.comentario}</p>
              <div className="person">
                <div className="avatar">{t.iniciales}</div>
                <div>
                  <h4>{t.nombre}</h4>
                  <span className="muted small">Paciente desde {t.desde}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section id="contacto" className="contacto">
        <h2 className="section-title">Contáctanos</h2>
        <p className="section-subtitle">
          Estamos aquí para ayudarte a comenzar tu transformación
        </p>

        <div className="contacto__grid">
          {/* ===== FORMULARIO (bloqueado) ===== */}
          <form className="form" onSubmit={handleBlockedSubmit}>
            <label>Nombre completo</label>
            <input
              type="text"
              name="nombre"
              placeholder="Tu nombre"
              value={contactoForm.nombre}
              onChange={handleContactoChange}
              required
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              placeholder="tu@email.com"
              value={contactoForm.correo}
              onChange={handleContactoChange}
              required
            />

            <label>Teléfono</label>
            <input
              type="tel"
              name="telefono"
              placeholder="(555) 123-4567"
              value={contactoForm.telefono}
              onChange={handleContactoChange}
            />

            <label>Mensaje</label>
            <textarea
              name="mensaje"
              rows={5}
              placeholder="¿En qué podemos ayudarte?"
              value={contactoForm.mensaje}
              onChange={handleContactoChange}
              required
            />

            <button className="btn-primary" type="submit">
              Enviar mensaje
            </button>
          </form>

          {/* ===== INFORMACIÓN DE CONTACTO ===== */}
          <div className="contacto__info">
            <div className="info-box">
              <div className="info-ico">📍</div>
              <div>
                <h4>Ubicación</h4>
                <p className="muted">
                  Avenida 30 de Abril #64, Colonia Centro, Buenavista de Cuéllar
                  40330
                </p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-ico">📞</div>
              <div>
                <h4>Teléfono</h4>
                <p className="muted">
                  727 100 1860
                </p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-ico">✉️</div>
              <div>
                <h4>Email</h4>
                <p className="muted">
                 an.nutricion@outlook.com
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

            {/* ===== MAPA ===== */}
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
              <img
                src={logoManzana}
                alt="AnNutrition"
                className="nav__icon"
              />
              <strong>AnNutrition</strong>
            </div>
            <p className="muted">Planes nutricionales personalizados.</p>
          </div>
          <div>
            <h4>Secciones</h4>
            <ul className="footer__links">
              <li>
                <a href="#inicio">Inicio</a>
              </li>
              <li>
                <a href="#quienes">¿Quiénes somos?</a>
              </li>
              <li>
                <a href="#servicios">Servicios</a>
              </li>
              <li>
                <a href="#material">Material</a>
              </li>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Contacto</h4>
            <ul className="footer__links">
              <li>
                <a href="mailto:contacto@nutrisystem.com">
                  an.nutricion@outlook.com
                </a>
              </li>
              <li>
                <a href="tel:+525551234567">7271001860</a>
              </li>
            </ul>
            <div className="social">
              <a
                href="https://www.facebook.com/share/1GUC96gtUB/?mibextid=wwXIfr"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
              >
                <img src={facebookIcon} alt="Facebook" />
              </a>
              <a
                href="https://www.instagram.com/annutricion.gro?igsh=NnRkOTQyc2VmYzQx"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <img src={instagramIcon} alt="Instagram" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer__bar">
          © {year} AnNutrition. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default AnNutritionPage;
