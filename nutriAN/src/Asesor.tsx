// src/Asesor.tsx
import React from "react";
import "./styles/asesores.css";
import logoManzana from "./assets/images/manzana.png";
import asesorImg from "./assets/images/usuario1.jpeg";

const Asesor: React.FC = () => {
  return (
    <main className="advisor-page">
      {/* HERO */}
      <section className="advisor-hero advisor-hero--reverse">
        <div className="advisor-hero__photo">
          <img
            src={asesorImg}
            alt="M.N.D. Noé Toribio Trujillo"
            className="advisor-hero__img"
          />
        </div>

        <div className="advisor-hero__content">
          <div className="advisor-hero__badge">
            <img src={logoManzana} alt="AnNutrición" />
            <span>Equipo AnNutrición</span>
          </div>

          <h1 className="advisor-hero__name">M.N.D. Noé Toribio Trujillo</h1>

          <p className="advisor-hero__role">
            Docente universitario · Nutriólogo clínico deportivo
          </p>

          <p className="advisor-hero__experience">
            +7 años de experiencia profesional
          </p>

          <div className="advisor-hero__tags">
            <span className="tag">Nutrición deportiva</span>
            <span className="tag">Fitness y rendimiento</span>
            <span className="tag">Suplementación</span>
            <span className="tag">Eventos académicos</span>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="advisor-detail">
        <div className="advisor-detail__card advisor-detail__card--main">
          <h2>Sobre el asesor</h2>
          <p>
            Docente universitario y nutriólogo privado con experiencia en
            nutrición clínico deportiva.
          </p>
          <p>
            Experiencia en el área de nutrición y entrenamiento para el
            fitness, nutrición deportiva y su aplicación en diferentes deportes
            y contextos de acuerdo a las características, necesidades y
            objetivos de los atletas.
          </p>
          <p>
            Asesor certificado en nutrición y suplementación con ayudas
            ergogénicas para la mejora en el rendimiento deportivo, salud y la
            composición corporal.
          </p>
          <p>
            Colaborador en la planeación, logística y administración en eventos
            de nutrición académicos a nivel nacional e internacional.
          </p>
        </div>

        <div className="advisor-detail__grid">
          <article className="advisor-detail__card">
            <h3>Cédulas profesionales</h3>
            <ul className="advisor-detail__list">
              <li>Cédula profesional Licenciatura: 12405290</li>
              <li>Cédula profesional Especialidad: 15211318</li>
              <li>Cédula profesional Maestría: 14658592</li>
            </ul>
          </article>

          <article className="advisor-detail__card advisor-detail__card--process">
            <h3>Proceso de atención</h3>
            <p>
              Nuestros servicios de consultoría nutricional se llevan a cabo
              con atención profesional y una calidad que nos distingue.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Asesor;
