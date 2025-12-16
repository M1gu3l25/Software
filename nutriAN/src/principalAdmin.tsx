// src/principalAdmin.tsx
import "./styles/stylesAdmin.css";
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

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

// ===== TIPOS =====
type AboutBlock = {
  id?: number;
  titulo: string;
  descripcion: string;
  iconoTipo: "emoji" | "imagen";
  iconoEmoji: string;
  orden: number;
};

type Servicio = {
  id?: number;
  titulo: string;
  precio_texto: string;
  punto1: string;
  punto2: string;
  punto3: string;
  icono_tipo: "emoji" | "imagen";
  icono_emoji: string;
  icono_imagen?: string | null;
  orden: number;
  activo: number;
};

type MaterialItem = {
  id?: number;
  categoria_texto: string;
  emoji_categoria: string;
  titulo: string;
  descripcion: string;
  boton_texto: string;
  imagen_url?: string | null;
  orden: number;
  activo: number;
  file?: File | null;
};

type Testimonial = {
  id: number;
  nombre: string;
  iniciales: string;
  desde: string;
  comentario: string;
  calificacion: number;
};

// Base del servidor (sin /api)
const SERVER_BASE =
  (import.meta.env.VITE_API_URL as string)?.replace(/\/$/, "") ||
  "http://localhost:4000";

// Base de la API (con /api)
const API_BASE = `${SERVER_BASE}/api`;

const materialImages = [mat1, mat2, mat3, mat4, mat5, mat6];

const SERVICES_PER_PAGE = 3;
const MATERIALS_PER_PAGE = 3;

const PrincipalAdmin: React.FC = () => {
  const navigate = useNavigate();

  // ==== EDITORES LATERALES =====
  const [openEditor, setOpenEditor] = useState(false);
  const [openServicesEditor, setOpenServicesEditor] = useState(false);
  const [openMaterialEditor, setOpenMaterialEditor] = useState(false);

  // ===== QUIÉNES SOMOS (SOLO UI, NO BD) =====
  const [aboutBlocks, setAboutBlocks] = useState<AboutBlock[]>([]);
  const [loadingAbout, setLoadingAbout] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);
  const [aboutError, setAboutError] = useState<string | null>(null);

  // ===== SERVICIOS =====
  const [services, setServices] = useState<Servicio[]>([]);
  const [loadingServices, setLoadingServices] = useState(false);
  const [savingServices, setSavingServices] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [servicePage, setServicePage] = useState(0);

  // ===== MATERIAL EDUCATIVO =====
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [savingMaterials, setSavingMaterials] = useState(false);
  const [materialsError, setMaterialsError] = useState<string | null>(null);
  const [materialPage, setMaterialPage] = useState(0);

  // ===== TESTIMONIOS =====
  const [testimonios, setTestimonios] = useState<Testimonial[]>([]);
  const [loadingTestimonios, setLoadingTestimonios] = useState(false);
  const [testimoniosError, setTestimoniosError] = useState<string | null>(null);

  // ===== LOGOUT =====
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  // ==========================
  //   QUIÉNES SOMOS (UI ONLY)
  // ==========================
  const loadAboutBlocks = async () => {
    // ✅ No existe endpoint en tu backend. Deja bloques vacíos o algunos por defecto si quieres.
    setLoadingAbout(true);
    setAboutError(null);

    // Puedes precargar algo si quieres (opcional)
    setAboutBlocks((prev) => prev);

    setLoadingAbout(false);
  };

  const handleSaveAboutBlocks = async () => {
    // ✅ No existe endpoint en tu backend. Guardado visual (no truena).
    try {
      setSavingAbout(true);
      setOpenEditor(false);
      alert("Cambios guardados (solo visual).");
    } finally {
      setSavingAbout(false);
    }
  };

  // ==========================
  //   CARGA: SERVICIOS
  // ==========================
  const loadServices = async () => {
    try {
      setLoadingServices(true);
      setServicesError(null);

      // ✅ CORREGIDO: /api/servicios
      const res = await fetch(`${API_BASE}/servicios`);
      if (!res.ok) throw new Error("No se pudieron cargar los servicios.");

      const data = await res.json();
      setServices(
        (data || []).map((srv: any) => ({
          id: srv.id,
          titulo: srv.titulo ?? "",
          precio_texto: srv.precio_texto ?? "",
          punto1: srv.punto1 ?? "",
          punto2: srv.punto2 ?? "",
          punto3: srv.punto3 ?? "",
          icono_tipo: srv.icono_tipo === "imagen" ? "imagen" : "emoji",
          icono_emoji: srv.icono_emoji ?? "📅",
          icono_imagen: srv.icono_imagen ?? null,
          orden: Number(srv.orden ?? 1),
          activo: Number(srv.activo ?? 1),
        }))
      );

      setServicePage(0);
    } catch (err: any) {
      console.error(err);
      setServicesError(err?.message || "Error al cargar servicios.");
    } finally {
      setLoadingServices(false);
    }
  };

  const handleSaveServices = async () => {
    try {
      setSavingServices(true);

      for (let i = 0; i < services.length; i++) {
        const srv = services[i];
        const orden = i + 1;

        const payload = {
          titulo: srv.titulo,
          precio_texto: srv.precio_texto,
          punto1: srv.punto1,
          punto2: srv.punto2,
          punto3: srv.punto3,
          icono_tipo: srv.icono_tipo,
          icono_emoji: srv.icono_emoji,
          icono_imagen: srv.icono_imagen,
          orden,
          activo: srv.activo,
        };

        if (srv.id) {
          // ✅ CORREGIDO: /api/servicios/:id
          const r = await fetch(`${API_BASE}/servicios/${srv.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!r.ok) throw new Error("No se pudo actualizar un servicio.");
        } else {
          // ✅ CORREGIDO: /api/servicios
          const r = await fetch(`${API_BASE}/servicios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!r.ok) throw new Error("No se pudo crear un servicio.");
        }
      }

      await loadServices();
      setOpenServicesEditor(false);
      alert("Servicios guardados.");
    } catch (err) {
      console.error(err);
      alert("Error guardando servicios.");
    } finally {
      setSavingServices(false);
    }
  };

  // ==========================
  //   CARGA: MATERIAL EDUCATIVO
  // ==========================
  const loadMaterials = async () => {
    try {
      setLoadingMaterials(true);
      setMaterialsError(null);

      // ✅ CORREGIDO: /api/material
      const res = await fetch(`${API_BASE}/material`);
      if (!res.ok) throw new Error("No se pudo cargar el material.");

      const data = await res.json();
      setMaterials(
        (data || []).map((m: any) => ({
          id: m.id,
          categoria_texto: m.categoria_texto ?? m.categoria ?? "",
          emoji_categoria: m.emoji_categoria ?? "📘",
          titulo: m.titulo ?? "",
          descripcion: m.descripcion ?? "",
          boton_texto: m.boton_texto ?? "Más información",
          imagen_url: m.imagen_url ?? null,
          orden: Number(m.orden ?? 1),
          activo: Number(m.activo ?? 1),
          file: null,
        }))
      );

      setMaterialPage(0);
    } catch (err: any) {
      console.error(err);
      setMaterialsError(err?.message || "Error al cargar material educativo.");
    } finally {
      setLoadingMaterials(false);
    }
  };

  const handleSaveMaterials = async () => {
    try {
      setSavingMaterials(true);

      for (let i = 0; i < materials.length; i++) {
        const mat = materials[i];
        const orden = i + 1;

        const form = new FormData();

        // ✅ Compat: manda ambos nombres por si tu backend usa uno u otro
        form.append("categoria_texto", mat.categoria_texto);
        form.append("categoria", mat.categoria_texto);

        form.append("emoji_categoria", mat.emoji_categoria);
        form.append("titulo", mat.titulo);
        form.append("descripcion", mat.descripcion);
        form.append("boton_texto", mat.boton_texto);
        form.append("orden", String(orden));
        form.append("activo", String(mat.activo));

        if (mat.file) form.append("imagen", mat.file);

        // ✅ CORREGIDO: /api/material (POST) y /api/material/:id (PUT)
        const url = mat.id ? `${API_BASE}/material/${mat.id}` : `${API_BASE}/material`;
        const method = mat.id ? "PUT" : "POST";

        const r = await fetch(url, { method, body: form });
        if (!r.ok) throw new Error("No se pudo guardar una tarjeta de material.");
      }

      await loadMaterials();
      setOpenMaterialEditor(false);
      alert("Material educativo guardado.");
    } catch (err) {
      console.error(err);
      alert("Error guardando material educativo.");
    } finally {
      setSavingMaterials(false);
    }
  };

  // ==========================
  //     CARGA: TESTIMONIOS
  // ==========================
  const loadTestimonios = async () => {
    try {
      setLoadingTestimonios(true);
      setTestimoniosError(null);

      // ✅ CORREGIDO: /api/comentarios
      const res = await fetch(`${API_BASE}/comentarios`);
      if (!res.ok) throw new Error("No se pudieron cargar los testimonios.");

      const data = await res.json();
      setTestimonios(
        (data || []).map((t: any) => {
          const nombre = (t.nombre ?? "").toString();
          const iniciales =
            nombre
              .trim()
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((p: string) => p[0].toUpperCase())
              .join("") || "US";

          return {
            id: Number(t.id),
            nombre,
            iniciales,
            desde: (t.desde ?? t.paciente_desde ?? year).toString(),
            comentario: (t.comentario ?? "").toString(),
            calificacion: Number(t.calificacion ?? 5),
          };
        })
      );
    } catch (err: any) {
      console.error(err);
      setTestimoniosError(err?.message || "No se pudieron cargar los testimonios.");
    } finally {
      setLoadingTestimonios(false);
    }
  };

  // ===== CARGA INICIAL =====
  useEffect(() => {
    void loadAboutBlocks();
    void loadServices();
    void loadMaterials();
    void loadTestimonios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reset páginas si cambia tamaño
  useEffect(() => setServicePage(0), [services.length]);
  useEffect(() => setMaterialPage(0), [materials.length]);

  // ======================
  //   CARRUSEL (DERIVADOS)
  // ======================
  const totalServicePages = useMemo(
    () =>
      services.length > 0 ? Math.ceil(services.length / SERVICES_PER_PAGE) : 1,
    [services.length]
  );

  const paginatedServices = useMemo(
    () =>
      services.slice(
        servicePage * SERVICES_PER_PAGE,
        servicePage * SERVICES_PER_PAGE + SERVICES_PER_PAGE
      ),
    [services, servicePage]
  );

  const totalMaterialPages = useMemo(
    () =>
      materials.length > 0
        ? Math.ceil(materials.length / MATERIALS_PER_PAGE)
        : 1,
    [materials.length]
  );

  const paginatedMaterials = useMemo(
    () =>
      materials.slice(
        materialPage * MATERIALS_PER_PAGE,
        materialPage * MATERIALS_PER_PAGE + MATERIALS_PER_PAGE
      ),
    [materials, materialPage]
  );

  const handlePrevServicePage = () => {
    if (services.length <= SERVICES_PER_PAGE) return;
    setServicePage((prev) => (prev === 0 ? totalServicePages - 1 : prev - 1));
  };

  const handleNextServicePage = () => {
    if (services.length <= SERVICES_PER_PAGE) return;
    setServicePage((prev) => (prev === totalServicePages - 1 ? 0 : prev + 1));
  };

  const handlePrevMaterialPage = () => {
    if (materials.length <= MATERIALS_PER_PAGE) return;
    setMaterialPage((prev) => (prev === 0 ? totalMaterialPages - 1 : prev - 1));
  };

  const handleNextMaterialPage = () => {
    if (materials.length <= MATERIALS_PER_PAGE) return;
    setMaterialPage((prev) => (prev === totalMaterialPages - 1 ? 0 : prev + 1));
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
            <button className="btn-primary" type="button">
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

      {/* ===== QUIÉNES SOMOS ===== */}
      <section id="quienes" className="about">
        <div className="about__grid">
          <figure className="about__photo">
            <img src={equipoImg} alt="Equipo AnNutrition" />
          </figure>

          <div className="about__panel">
            <div className="about__title-row">
              <h2 className="about__title">¿Quiénes somos?</h2>

              <button
                type="button"
                className="title-action"
                aria-label="Editar sección ¿Quiénes somos?"
                onClick={() => setOpenEditor(true)}
              >
                +
              </button>
            </div>

            <p className="about__lead">
              Somos un equipo de profesionales apasionados por la nutrición y el
              bienestar integral
            </p>

            <ul className="about__list">
              {/* Bloques base fijos */}
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

              {/* Bloques extra (solo UI) */}
              {aboutBlocks.map((block) => (
                <li
                  className="about__item"
                  key={block.id ?? `${block.titulo}-${block.orden}`}
                >
                  <span className="badge">{block.iconoEmoji || "🍏"}</span>
                  <div>
                    <h3>{block.titulo}</h3>
                    <p>{block.descripcion}</p>
                  </div>
                </li>
              ))}
            </ul>

            {loadingAbout && <p className="muted">Cargando bloques…</p>}
            {aboutError && <p className="error">{aboutError}</p>}
          </div>
        </div>

        {/* Backdrop */}
        <div
          className={`admin-backdrop ${openEditor ? "is-open" : ""}`}
          onClick={() => setOpenEditor(false)}
          aria-hidden={!openEditor}
        />

        {/* Drawer */}
        <aside
          className={`admin-drawer ${openEditor ? "is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="qs-editor-title"
        >
          <header className="admin-drawer__header">
            <h3 id="qs-editor-title">Editar “¿Quiénes somos?”</h3>
            <button
              className="icon-close"
              aria-label="Cerrar"
              onClick={() => setOpenEditor(false)}
              type="button"
            >
              ×
            </button>
          </header>

          <div className="admin-drawer__body">
            <section className="panel-block">
              <div className="panel-block__head">
                <h4>Bloques (solo visual)</h4>
                <button
                  type="button"
                  className="btn-outline sm"
                  onClick={() =>
                    setAboutBlocks((prev) => [
                      ...prev,
                      {
                        titulo: "",
                        descripcion: "",
                        iconoTipo: "emoji",
                        iconoEmoji: "🍏",
                        orden: prev.length + 1,
                      },
                    ])
                  }
                >
                  + Agregar bloque
                </button>
              </div>

              {aboutBlocks.map((block, index) => (
                <div
                  className="repeater-row"
                  key={block.id ?? `nuevo-${index}`}
                >
                  <span className="drag-handle" title="Arrastrar (visual)">
                    ⋮⋮
                  </span>

                  <div className="repeater-fields">
                    <label>
                      Título
                      <input
                        type="text"
                        value={block.titulo}
                        onChange={(e) =>
                          setAboutBlocks((prev) =>
                            prev.map((b, i) =>
                              i === index
                                ? { ...b, titulo: e.target.value }
                                : b
                            )
                          )
                        }
                      />
                    </label>

                    <label>
                      Descripción
                      <textarea
                        rows={3}
                        value={block.descripcion}
                        onChange={(e) =>
                          setAboutBlocks((prev) =>
                            prev.map((b, i) =>
                              i === index
                                ? { ...b, descripcion: e.target.value }
                                : b
                            )
                          )
                        }
                      />
                    </label>

                    <div className="inline-2">
                      <label>
                        Emoji
                        <input
                          type="text"
                          value={block.iconoEmoji}
                          onChange={(e) =>
                            setAboutBlocks((prev) =>
                              prev.map((b, i) =>
                                i === index
                                  ? { ...b, iconoEmoji: e.target.value }
                                  : b
                              )
                            )
                          }
                        />
                      </label>

                      <label>
                        Orden
                        <input
                          type="number"
                          min={1}
                          value={block.orden}
                          onChange={(e) =>
                            setAboutBlocks((prev) =>
                              prev.map((b, i) =>
                                i === index
                                  ? {
                                      ...b,
                                      orden: Number(e.target.value) || 1,
                                    }
                                  : b
                              )
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="row-actions">
                    <button
                      className="icon-btn danger"
                      title="Eliminar"
                      type="button"
                      onClick={() =>
                        setAboutBlocks((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}

              {!loadingAbout && aboutBlocks.length === 0 && (
                <p className="muted small">
                  No hay bloques. Usa “+ Agregar bloque”.
                </p>
              )}
            </section>
          </div>

          <footer className="admin-drawer__footer">
            <button
              className="btn-outline"
              onClick={() => setOpenEditor(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={handleSaveAboutBlocks}
              disabled={savingAbout}
            >
              {savingAbout ? "Guardando..." : "Guardar cambios"}
            </button>
          </footer>
        </aside>

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
                onClick={() => navigate("/asesora")}
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
                onClick={() => navigate("/asesor")}
              >
                Ver perfil completo
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* ===== NUESTROS SERVICIOS (CARRUSEL) ===== */}
      <section id="servicios" className="services">
        <div className="section-title-row">
          <h2 className="section-title">Nuestros Servicios</h2>
          <button
            type="button"
            className="title-action"
            aria-label="Editar sección Nuestros Servicios"
            onClick={() => setOpenServicesEditor(true)}
          >
            +
          </button>
        </div>

        <p className="section-subtitle">
          Soluciones nutricionales integrales para cada necesidad
        </p>

        <div className="carousel-wrapper">
          <button
            type="button"
            className="carousel-arrow carousel-arrow--left"
            onClick={handlePrevServicePage}
            disabled={services.length <= SERVICES_PER_PAGE}
          >
            ‹
          </button>

          <div className="carousel-viewport">
            <div className="cards">
              {loadingServices && <p className="muted">Cargando servicios…</p>}
              {servicesError && <p className="error">{servicesError}</p>}

              {!loadingServices && !servicesError && services.length === 0 && (
                <p className="muted">Aún no se han registrado servicios.</p>
              )}

              {paginatedServices.map((srv) => (
                <article
                  className="card card--material"
                  key={srv.id ?? `${srv.titulo}-${srv.orden}`}
                >
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
                  <button className="btn-primary full" type="button">
                    Más información
                  </button>
                </article>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="carousel-arrow carousel-arrow--right"
            onClick={handleNextServicePage}
            disabled={services.length <= SERVICES_PER_PAGE}
          >
            ›
          </button>
        </div>

        {services.length > SERVICES_PER_PAGE && (
          <div className="carousel-dots">
            {Array.from({ length: totalServicePages }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={
                  i === servicePage
                    ? "carousel-dot carousel-dot--active"
                    : "carousel-dot"
                }
                onClick={() => setServicePage(i)}
              />
            ))}
          </div>
        )}

        {/* Backdrop del editor */}
        <div
          className={`admin-backdrop ${openServicesEditor ? "is-open" : ""}`}
          onClick={() => setOpenServicesEditor(false)}
          aria-hidden={!openServicesEditor}
        />

        {/* Drawer del editor */}
        <aside
          className={`admin-drawer ${openServicesEditor ? "is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="services-editor-title"
        >
          <header className="admin-drawer__header">
            <h3 id="services-editor-title">Editar “Nuestros Servicios”</h3>
            <button
              className="icon-close"
              aria-label="Cerrar"
              onClick={() => setOpenServicesEditor(false)}
              type="button"
            >
              ×
            </button>
          </header>

          <div className="admin-drawer__body">
            <div className="panel-block__head">
              <h4>Servicios</h4>
              <button
                className="btn-outline sm"
                type="button"
                onClick={() =>
                  setServices((prev) => [
                    ...prev,
                    {
                      titulo: "",
                      precio_texto: "",
                      punto1: "",
                      punto2: "",
                      punto3: "",
                      icono_tipo: "emoji",
                      icono_emoji: "📅",
                      icono_imagen: null,
                      orden: prev.length + 1,
                      activo: 1,
                    },
                  ])
                }
              >
                + Agregar servicio
              </button>
            </div>

            {services.map((srv, index) => (
              <div className="repeater-row" key={srv.id ?? `nuevo-${index}`}>
                <span className="drag-handle" title="Arrastrar para reordenar">
                  ⋮⋮
                </span>

                <div className="repeater-fields">
                  <div className="inline-2">
                    <label>
                      Título
                      <input
                        type="text"
                        value={srv.titulo}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? { ...s, titulo: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                    </label>

                    <label>
                      Precio (texto)
                      <input
                        type="text"
                        value={srv.precio_texto}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? { ...s, precio_texto: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="inline-3">
                    <label>
                      Punto 1
                      <input
                        type="text"
                        value={srv.punto1}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? { ...s, punto1: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                    </label>

                    <label>
                      Punto 2
                      <input
                        type="text"
                        value={srv.punto2}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? { ...s, punto2: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                    </label>

                    <label>
                      Punto 3
                      <input
                        type="text"
                        value={srv.punto3}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? { ...s, punto3: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="inline-2">
                    <label>
                      Ícono (emoji)
                      <input
                        type="text"
                        value={srv.icono_emoji}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? { ...s, icono_emoji: e.target.value }
                                : s
                            )
                          )
                        }
                      />
                    </label>

                    <label>
                      Activo (1/0)
                      <input
                        type="number"
                        min={0}
                        max={1}
                        value={srv.activo}
                        onChange={(e) =>
                          setServices((prev) =>
                            prev.map((s, i) =>
                              i === index
                                ? { ...s, activo: Number(e.target.value) || 0 }
                                : s
                            )
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="row-actions">
                  <button
                    className="icon-btn danger"
                    title="Eliminar"
                    type="button"
                    onClick={async () => {
                      const current = services[index];

                      if (current.id) {
                        try {
                          // ✅ CORREGIDO: /api/servicios/:id
                          const res = await fetch(
                            `${API_BASE}/servicios/${current.id}`,
                            { method: "DELETE" }
                          );
                          if (!res.ok)
                            throw new Error("No se pudo eliminar el servicio.");
                        } catch (err) {
                          console.error(err);
                          alert("Error al eliminar el servicio en el servidor.");
                          return;
                        }
                      }

                      setServices((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          <footer className="admin-drawer__footer">
            <button
              className="btn-outline"
              onClick={() => setOpenServicesEditor(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={handleSaveServices}
              disabled={savingServices}
            >
              {savingServices ? "Guardando..." : "Guardar cambios"}
            </button>
          </footer>
        </aside>
      </section>

      {/* ===== MATERIAL EDUCATIVO (CARRUSEL) ===== */}
      <section id="material" className="material">
        <div className="section-title-row">
          <h2 className="section-title">Material Educativo</h2>
          <button
            type="button"
            className="title-action"
            aria-label="Editar sección Material Educativo"
            onClick={() => setOpenMaterialEditor(true)}
          >
            +
          </button>
        </div>

        <p className="section-subtitle">
          Aprende más sobre nutrición y bienestar
        </p>

        <div className="carousel-wrapper">
          <button
            type="button"
            className="carousel-arrow carousel-arrow--left"
            onClick={handlePrevMaterialPage}
            disabled={materials.length <= MATERIALS_PER_PAGE}
          >
            ‹
          </button>

          <div className="carousel-viewport">
            <div className="cards">
              {loadingMaterials && <p className="muted">Cargando material…</p>}
              {materialsError && <p className="error">{materialsError}</p>}

              {!loadingMaterials &&
                !materialsError &&
                materials.length === 0 && (
                  <p className="muted">
                    Aún no se ha registrado material educativo.
                  </p>
                )}

              {paginatedMaterials.map((mat, index) => {
                const imgSrc = mat.imagen_url
                  ? `${SERVER_BASE}${mat.imagen_url}`
                  : materialImages[index % materialImages.length];

                return (
                  <article
                    className="card card--material"
                    key={mat.id ?? `${mat.titulo}-${mat.orden}`}
                  >
                    <img src={imgSrc} alt={mat.titulo} />
                    <div className="card__body">
                      <span className="muted small">
                        {mat.emoji_categoria} {mat.categoria_texto}
                      </span>
                      <h3 className="card__title">{mat.titulo}</h3>
                      <p className="muted">{mat.descripcion}</p>
                      <button className="btn-outline full" type="button">
                        {mat.boton_texto || "Más información"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            className="carousel-arrow carousel-arrow--right"
            onClick={handleNextMaterialPage}
            disabled={materials.length <= MATERIALS_PER_PAGE}
          >
            ›
          </button>
        </div>

        {materials.length > MATERIALS_PER_PAGE && (
          <div className="carousel-dots">
            {Array.from({ length: totalMaterialPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                className={
                  i === materialPage
                    ? "carousel-dot carousel-dot--active"
                    : "carousel-dot"
                }
                onClick={() => setMaterialPage(i)}
              />
            ))}
          </div>
        )}

        {/* Backdrop y Drawer de edición de material */}
        <div
          className={`admin-backdrop ${openMaterialEditor ? "is-open" : ""}`}
          onClick={() => setOpenMaterialEditor(false)}
          aria-hidden={!openMaterialEditor}
        />

        <aside
          className={`admin-drawer ${openMaterialEditor ? "is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="material-editor-title"
        >
          <header className="admin-drawer__header">
            <h3 id="material-editor-title">Editar “Material Educativo”</h3>
            <button
              className="icon-close"
              aria-label="Cerrar"
              onClick={() => setOpenMaterialEditor(false)}
              type="button"
            >
              ×
            </button>
          </header>

          <div className="admin-drawer__body">
            <div className="panel-block__head">
              <h4>Tarjetas</h4>
              <button
                className="btn-outline sm"
                type="button"
                onClick={() =>
                  setMaterials((prev) => [
                    ...prev,
                    {
                      categoria_texto: "",
                      emoji_categoria: "📘",
                      titulo: "",
                      descripcion: "",
                      boton_texto: "Más información",
                      imagen_url: null,
                      orden: prev.length + 1,
                      activo: 1,
                      file: null,
                    },
                  ])
                }
              >
                + Agregar tarjeta
              </button>
            </div>

            {materials.map((mat, index) => (
              <div className="repeater-row" key={mat.id ?? `nuevo-${index}`}>
                <span className="drag-handle" title="Arrastrar para reordenar">
                  ⋮⋮
                </span>

                <div className="repeater-fields">
                  <div className="inline-2">
                    <label>
                      Categoría (texto)
                      <input
                        type="text"
                        value={mat.categoria_texto}
                        onChange={(e) =>
                          setMaterials((prev) =>
                            prev.map((m, i) =>
                              i === index
                                ? { ...m, categoria_texto: e.target.value }
                                : m
                            )
                          )
                        }
                      />
                    </label>

                    <label>
                      Emoji categoría
                      <input
                        type="text"
                        value={mat.emoji_categoria}
                        onChange={(e) =>
                          setMaterials((prev) =>
                            prev.map((m, i) =>
                              i === index
                                ? { ...m, emoji_categoria: e.target.value }
                                : m
                            )
                          )
                        }
                      />
                    </label>
                  </div>

                  <label>
                    Título
                    <input
                      type="text"
                      value={mat.titulo}
                      onChange={(e) =>
                        setMaterials((prev) =>
                          prev.map((m, i) =>
                            i === index ? { ...m, titulo: e.target.value } : m
                          )
                        )
                      }
                    />
                  </label>

                  <label>
                    Descripción
                    <textarea
                      rows={3}
                      value={mat.descripcion}
                      onChange={(e) =>
                        setMaterials((prev) =>
                          prev.map((m, i) =>
                            i === index
                              ? { ...m, descripcion: e.target.value }
                              : m
                          )
                        )
                      }
                    />
                  </label>

                  <div className="inline-2">
                    <label>
                      Subir imagen
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setMaterials((prev) =>
                            prev.map((m, i) =>
                              i === index ? { ...m, file } : m
                            )
                          );
                        }}
                      />
                    </label>

                    <label>
                      Botón (texto)
                      <input
                        type="text"
                        value={mat.boton_texto}
                        onChange={(e) =>
                          setMaterials((prev) =>
                            prev.map((m, i) =>
                              i === index
                                ? { ...m, boton_texto: e.target.value }
                                : m
                            )
                          )
                        }
                      />
                    </label>
                  </div>

                  <div className="inline-2">
                    <label>
                      Activo (1/0)
                      <input
                        type="number"
                        min={0}
                        max={1}
                        value={mat.activo}
                        onChange={(e) =>
                          setMaterials((prev) =>
                            prev.map((m, i) =>
                              i === index
                                ? { ...m, activo: Number(e.target.value) || 0 }
                                : m
                            )
                          )
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="row-actions">
                  <button
                    className="icon-btn danger"
                    title="Eliminar"
                    type="button"
                    onClick={async () => {
                      const current = materials[index];

                      if (current.id) {
                        try {
                          // ✅ CORREGIDO: /api/material/:id
                          const res = await fetch(
                            `${API_BASE}/material/${current.id}`,
                            { method: "DELETE" }
                          );
                          if (!res.ok)
                            throw new Error("No se pudo eliminar el material.");
                        } catch (err) {
                          console.error(err);
                          alert("Error al eliminar el material en el servidor.");
                          return;
                        }
                      }

                      setMaterials((prev) => prev.filter((_, i) => i !== index));
                    }}
                  >
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>

          <footer className="admin-drawer__footer">
            <button
              className="btn-outline"
              onClick={() => setOpenMaterialEditor(false)}
              type="button"
            >
              Cancelar
            </button>
            <button
              className="btn-primary"
              type="button"
              onClick={handleSaveMaterials}
              disabled={savingMaterials}
            >
              {savingMaterials ? "Guardando..." : "Guardar cambios"}
            </button>
          </footer>
        </aside>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section id="testimonios" className="testimonios">
        <h2 className="section-title">Lo que dicen nuestros pacientes</h2>
        <p className="section-subtitle">Historias reales de transformación</p>

        {loadingTestimonios && (
          <p className="muted">Cargando testimonios…</p>
        )}
        {testimoniosError && <p className="error">{testimoniosError}</p>}

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

          {!loadingTestimonios &&
            !testimoniosError &&
            testimonios.length === 0 && (
              <p className="muted">Aún no hay comentarios registrados.</p>
            )}
        </div>
      </section>

      {/* ===== CONTACTO (visual) ===== */}
      <section id="contacto" className="contacto">
        <h2 className="section-title">Contáctanos</h2>
        <p className="section-subtitle">
          Estamos aquí para ayudarte a comenzar tu transformación
        </p>

        <div className="contacto__grid">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
            <label>Nombre completo</label>
            <input type="text" placeholder="Tu nombre" />

            <label>Correo electrónico</label>
            <input type="email" placeholder="tu@email.com" />

            <label>Teléfono</label>
            <input type="tel" placeholder="(555) 123-4567" />

            <label>Mensaje</label>
            <textarea rows={5} placeholder="¿En qué podemos ayudarte?" />

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
                  Avenida 30 de Abril #64, Colonia Centro, Buenavista de Cuéllar
                  40330
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3761.6325783393313!2d-99.488084!3d18.365117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cf100178e333dd%3A0x3e0efa5bb529d590!2sAv.%2030%20de%20Abril%2064%2C%20Centro%2C%20Buenavista%20de%20Cu%C3%A9llar%2C%20Gro.%2040330!5e0!3m2!1es!2smx!4v1701234567890"
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
                <a href="mailto:an.nutricion@outlook.com">
                  an.nutricion@outlook.com
                </a>
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

export default PrincipalAdmin;
