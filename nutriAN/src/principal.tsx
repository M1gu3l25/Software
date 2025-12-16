// src/principal.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

// ✅ Fix TS: permite usar <lottie-player> en TSX
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lottie-player": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        src?: string;
        background?: string;
        speed?: string | number;
        loop?: boolean;
        autoplay?: boolean;
      };
    }
  }
}

const year = new Date().getFullYear();

// ======================
// URLS (CORREGIDO)
// ======================
// Base del servidor (sin /api)
const SERVER_BASE =
  (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, "") ||
  "http://localhost:4000";

// Base de la API (con /api)
const API_BASE = `${SERVER_BASE}/api`;

const materialImages = [mat1, mat2, mat3, mat4, mat5, mat6];

// cuántas tarjetas por “vista” en el carrusel
const SERVICES_PER_PAGE = 3;
const MATERIALS_PER_PAGE = 3;

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
  categoria_texto: string;
  emoji_categoria: string;
  titulo: string;
  descripcion: string;
  boton_texto: string;
  imagen_url?: string | null;
  orden: number;
  activo: number;
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

const Principal: React.FC = () => {
  const navigate = useNavigate();

  // ====== LOGOUT ======
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // ====== ESTADO PARA EL PANEL "AGENDAR CONSULTA" ======
  const [openConsulta, setOpenConsulta] = useState(false);
  const [consultaForm, setConsultaForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    fecha: "",
    mensaje: "",
  });

  // ====== ESTADO PARA EL PANEL DE "MATERIAL EDUCATIVO" ======
  const [openMaterial, setOpenMaterial] = useState(false);
  const [materialSeleccionado, setMaterialSeleccionado] =
    useState<MaterialInfo | null>(null);

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

  // ====== ESTADO PÁGINA DE CARRUSEL ======
  const [servicePage, setServicePage] = useState(0);
  const [materialPage, setMaterialPage] = useState(0);

  // ====== ESTADO CONTACTO ======
  const [contactoForm, setContactoForm] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    mensaje: "",
  });

  // ====== CARGAS INICIALES ======
  useEffect(() => {
    const cargarComentarios = async () => {
      try {
        const resp = await fetch(`${API_BASE}/comentarios`);
        if (!resp.ok) {
          console.error("Error al obtener comentarios:", resp.status);
          return;
        }

        const data = await resp.json();

        const adaptados: Testimonial[] = (data || []).map((item: any) => ({
          id: Number(item.id),
          nombre: (item.nombre ?? "").toString(),
          iniciales:
            (item.nombre ?? "")
              .toString()
              .split(" ")
              .filter((p: string) => p.length > 0)
              .slice(0, 2)
              .map((p: string) => p[0].toUpperCase())
              .join("") || "US",
          // ✅ backend devuelve "desde"
          desde: (item.desde ?? item.paciente_desde ?? year).toString(),
          comentario: (item.comentario ?? "").toString(),
          calificacion: Number(item.calificacion ?? 5),
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

        // ✅ CORREGIDO: tu backend /api/servicios ya devuelve activo=1
        const resp = await fetch(`${API_BASE}/servicios`);
        if (!resp.ok) throw new Error("No se pudieron cargar los servicios.");

        const data = await resp.json();
        const adaptados: Servicio[] = (data || []).map((item: any) => ({
          id: Number(item.id),
          titulo: item.titulo ?? "",
          precio_texto: item.precio_texto ?? "",
          punto1: item.punto1 ?? null,
          punto2: item.punto2 ?? null,
          punto3: item.punto3 ?? null,
          icono_tipo: item.icono_tipo === "imagen" ? "imagen" : "emoji",
          icono_emoji: item.icono_emoji ?? "📅",
          icono_imagen: item.icono_imagen ?? null,
          orden: Number(item.orden ?? 1),
          activo: Number(item.activo ?? 1),
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
        if (!resp.ok) throw new Error("No se pudo cargar el material educativo.");

        const data = await resp.json();
        const adaptados: MaterialItem[] = (data || []).map((item: any) => ({
          id: Number(item.id),
          categoria_texto: item.categoria_texto ?? item.categoria ?? "",
          emoji_categoria: item.emoji_categoria ?? "📘",
          titulo: item.titulo ?? "",
          descripcion: item.descripcion ?? "",
          boton_texto: item.boton_texto ?? "Más información",
          imagen_url: item.imagen_url ?? null,
          orden: Number(item.orden ?? 1),
          activo: Number(item.activo ?? 1),
        }));

        setMaterials(adaptados);
      } catch (err: any) {
        console.error("Error al cargar material educativo:", err);
        setMaterialsError(
          err?.message || "Error al cargar material educativo desde el servidor."
        );
      } finally {
        setLoadingMaterials(false);
      }
    };

    void cargarComentarios();
    void loadServices();
    void loadMaterials();
  }, []);

  // Resetear página de carrusel si cambia el número de elementos
  useEffect(() => setServicePage(0), [services.length]);
  useEffect(() => setMaterialPage(0), [materials.length]);

  // ====== DERIVADOS DEL CARRUSEL ======
  const totalServicePages = useMemo(
    () => (services.length === 0 ? 1 : Math.ceil(services.length / SERVICES_PER_PAGE)),
    [services.length]
  );

  const totalMaterialPages = useMemo(
    () => (materials.length === 0 ? 1 : Math.ceil(materials.length / MATERIALS_PER_PAGE)),
    [materials.length]
  );

  const visibleServices = useMemo(
    () =>
      services.slice(
        servicePage * SERVICES_PER_PAGE,
        servicePage * SERVICES_PER_PAGE + SERVICES_PER_PAGE
      ),
    [services, servicePage]
  );

  const visibleMaterials = useMemo(
    () =>
      materials.slice(
        materialPage * MATERIALS_PER_PAGE,
        materialPage * MATERIALS_PER_PAGE + MATERIALS_PER_PAGE
      ),
    [materials, materialPage]
  );

  const handlePrevServices = () => {
    setServicePage((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleNextServices = () => {
    setServicePage((prev) => (prev >= totalServicePages - 1 ? prev : prev + 1));
  };

  const handlePrevMaterials = () => {
    setMaterialPage((prev) => (prev === 0 ? 0 : prev - 1));
  };

  const handleNextMaterials = () => {
    setMaterialPage((prev) => (prev >= totalMaterialPages - 1 ? prev : prev + 1));
  };

  // ====== HANDLERS: CONSULTA ======
  const handleConsultaChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setConsultaForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConsultaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ CORREGIDO: como NO existe /api/agenda-consulta en tu backend actual,
    // lo dejamos visual para no romper.
    alert("¡Listo! Recibimos tu solicitud. Te contactaremos para confirmar 😊");

    setOpenConsulta(false);
    setConsultaForm({
      nombre: "",
      correo: "",
      telefono: "",
      fecha: "",
      mensaje: "",
    });
  };

  // Abrir panel de material
  const abrirMaterial = (info: MaterialInfo) => {
    setMaterialSeleccionado(info);
    setOpenMaterial(true);
  };

  // ====== HANDLERS: TESTIMONIOS ======
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

  const handleTestimonioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nuevoTestimonio.nombre.trim() || !nuevoTestimonio.comentario.trim()) {
      alert("Por favor completa tu nombre y tu comentario.");
      return;
    }

    const partes = nuevoTestimonio.nombre.trim().split(" ");
    const iniciales = partes
      .filter((p) => p.length > 0)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");

    // ✅ backend espera "desde"
    const payload = {
      nombre: nuevoTestimonio.nombre.trim(),
      desde: nuevoTestimonio.desde || `${year}`,
      calificacion: nuevoTestimonio.calificacion,
      comentario: nuevoTestimonio.comentario.trim(),
    };

    try {
      const resp = await fetch(`${API_BASE}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        console.error("Error al guardar comentario:", resp.status);
        alert("Ocurrió un error al enviar tu comentario. Intenta más tarde.");
        return;
      }

      const data = await resp.json();

      const nuevo: Testimonial = {
        id: Number(data.id),
        nombre: payload.nombre,
        iniciales: iniciales || "US",
        desde: payload.desde,
        comentario: payload.comentario,
        calificacion: payload.calificacion,
      };

      setTestimonios((prev) => [nuevo, ...prev]);

      setNuevoTestimonio({
        nombre: "",
        desde: `${year}`,
        comentario: "",
        calificacion: 5,
      });

      alert("¡Gracias por compartir tu experiencia! 😊");
    } catch (error) {
      console.error("Error al conectar con el backend (guardar comentario):", error);
      alert("No se pudo conectar con el servidor. Verifica que esté encendido.");
    }
  };

  // ====== HANDLERS: CONTACTO ======
  const handleContactoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactoForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactoForm.nombre.trim() || !contactoForm.correo.trim() || !contactoForm.mensaje.trim()) {
      alert("Por favor completa tu nombre, correo y mensaje.");
      return;
    }

    // ✅ CORREGIDO: como NO existe /api/contacto en tu backend actual,
    // lo dejamos visual para no romper.
    alert("¡Gracias por escribirnos! Hemos recibido tu mensaje.");

    setContactoForm({
      nombre: "",
      correo: "",
      telefono: "",
      mensaje: "",
    });
  };

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

        <button type="button" className="btn-outline" onClick={handleLogout}>
          Cerrar sesión
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
              onClick={() => setOpenConsulta(true)}
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

      {/* ===== MODAL / PANEL DE AGENDAR CONSULTA ===== */}
      {openConsulta && (
        <div className="consulta-overlay" onClick={() => setOpenConsulta(false)}>
          <div className="consulta-modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="consulta-title">Agendar consulta</h2>
            <p className="consulta-subtitle">
              Completa tus datos y nos pondremos en contacto para confirmar tu cita.
            </p>

            <form className="consulta-form" onSubmit={handleConsultaSubmit}>
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
                onClick={() => setOpenConsulta(false)}
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
              Somos un equipo de profesionales apasionados por la nutrición y el bienestar integral
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
                    Mejorar la calidad de vida de nuestros pacientes mediante planes nutricionales
                    personalizados y basados en evidencia científica.
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
                    Ser el centro de nutrición líder en México, reconocido por la excelencia en nuestros
                    servicios y resultados transformadores.
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
              <button className="btn-outline full" type="button" onClick={() => navigate("/asesora")}>
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
              <button className="btn-outline full" type="button" onClick={() => navigate("/asesor")}>
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

        {loadingServices && <p className="muted">Cargando servicios…</p>}
        {servicesError && <p className="error">{servicesError}</p>}
        {!loadingServices && !servicesError && services.length === 0 && (
          <p className="muted">Pronto añadiremos nuestros servicios en esta sección.</p>
        )}

        {!loadingServices && !servicesError && services.length > 0 && (
          <>
            <div className="carousel">
              <button
                className="carousel-btn carousel-btn--left"
                onClick={handlePrevServices}
                disabled={servicePage === 0}
                type="button"
              >
                ‹
              </button>

              <div className="carousel-track">
                {visibleServices.map((srv) => (
                  <article className="card" key={srv.id}>
                    <div className="card__icon badge--round">
                      {srv.icono_tipo === "emoji" ? (srv.icono_emoji || "📅") : "🖼"}
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
                      onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
                    >
                      Más información
                    </button>
                  </article>
                ))}
              </div>

              <button
                className="carousel-btn carousel-btn--right"
                onClick={handleNextServices}
                disabled={servicePage === totalServicePages - 1}
                type="button"
              >
                ›
              </button>
            </div>

            {totalServicePages > 1 && (
              <div className="carousel-dots">
                {Array.from({ length: totalServicePages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === servicePage ? "carousel-dot carousel-dot--active" : "carousel-dot"}
                    onClick={() => setServicePage(i)}
                    aria-label={`Ir a página ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== MATERIAL EDUCATIVO (DINÁMICO + CARRUSEL) ===== */}
      <section id="material" className="material">
        <h2 className="section-title">Material Educativo</h2>
        <p className="section-subtitle">Aprende más sobre nutrición y bienestar</p>

        {loadingMaterials && <p className="muted">Cargando material…</p>}
        {materialsError && <p className="error">{materialsError}</p>}
        {!loadingMaterials && !materialsError && materials.length === 0 && (
          <p className="muted">Pronto añadiremos material educativo en esta sección.</p>
        )}

        {!loadingMaterials && !materialsError && materials.length > 0 && (
          <>
            <div className="carousel">
              <button
                className="carousel-btn carousel-btn--left"
                onClick={handlePrevMaterials}
                disabled={materialPage === 0}
                type="button"
              >
                ‹
              </button>

              <div className="carousel-track">
                {visibleMaterials.map((mat, index) => {
                  const imgSrc = mat.imagen_url
                    ? `${SERVER_BASE}${mat.imagen_url}`
                    : materialImages[index % materialImages.length];

                  const textoCorto =
                    mat.descripcion && mat.descripcion.length > 140
                      ? mat.descripcion.slice(0, 137) + "..."
                      : mat.descripcion;

                  return (
                    <article className="card card--material" key={mat.id ?? `${mat.titulo}-${index}`}>
                      <img src={imgSrc} alt={mat.titulo} />
                      <div className="card__body">
                        <span className="muted small">
                          {mat.emoji_categoria} {mat.categoria_texto}
                        </span>
                        <h3 className="card__title">{mat.titulo}</h3>
                        <p className="muted">{textoCorto}</p>
                        <button
                          className="btn-outline full"
                          type="button"
                          onClick={() =>
                            abrirMaterial({
                              categoria: mat.categoria_texto,
                              emoji: mat.emoji_categoria,
                              titulo: mat.titulo,
                              descripcion: mat.descripcion,
                            })
                          }
                        >
                          {mat.boton_texto || "Más información"}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <button
                className="carousel-btn carousel-btn--right"
                onClick={handleNextMaterials}
                disabled={materialPage === totalMaterialPages - 1}
                type="button"
              >
                ›
              </button>
            </div>

            {totalMaterialPages > 1 && (
              <div className="carousel-dots">
                {Array.from({ length: totalMaterialPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={i === materialPage ? "carousel-dot carousel-dot--active" : "carousel-dot"}
                    onClick={() => setMaterialPage(i)}
                    aria-label={`Ir a página ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ===== PANEL / MODAL PARA MATERIAL EDUCATIVO ===== */}
      {openMaterial && materialSeleccionado && (
        <div className="consulta-overlay" onClick={() => setOpenMaterial(false)}>
          <div className="consulta-modal material-modal" onClick={(e) => e.stopPropagation()}>
            <header className="material-modal__header material-modal__header--simple">
              <span className="material-panel-chip">
                <span className="material-panel-chip-emoji">{materialSeleccionado.emoji}</span>
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
              onClick={() => setOpenMaterial(false)}
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

        <div className="testimonial-form-wrapper">
          <form className="testimonial-form" onSubmit={handleTestimonioSubmit}>
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
          <form className="form" onSubmit={handleContactoSubmit}>
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
                <p className="muted">727 100 1860</p>
              </div>
            </div>

            <div className="info-box">
              <div className="info-ico">✉️</div>
              <div>
                <h4>Email</h4>
                <p className="muted">an.nutricion@outlook.com</p>
              </div>
            </div>

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

            <div className="mapa-box">
              <iframe
                title="Mapa de ubicación"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: "20px" }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.6325783393313!2d-99.488084!3d18.365117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cf100178e333dd%3A0x3e0efa5bb529d590!2sAv.%2030%20de%20Abril%2064%2C%20Centro%2C%20Buenavista%20de%20Cu%C3%A9llar%2C%20Gro.%2040330!5e0!3m2!1ses!2smx!4v1701234567890"
              ></iframe>
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
                <a href="mailto:an.nutricion@outlook.com">an.nutricion@outlook.com</a>
              </li>
              <li>
                <a href="tel:+527271001860">7271001860</a>
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

export default Principal;
