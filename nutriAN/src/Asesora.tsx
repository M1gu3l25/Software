// src/Asesora.tsx
import React from "react";
import "./styles/asesores.css";
import logoManzana from "./assets/images/manzana.png";
import asesoraImg from "./assets/images/usuario2.jpeg";

const Asesora: React.FC = () => {
  return (
    <main className="advisor-page">
      {/* HERO */}
      <section className="advisor-hero">
        <div className="advisor-hero__photo">
          <img
            src={asesoraImg}
            alt="M.N.D. Alejandra Jocelyn Gómez Nava"
            className="advisor-hero__img"
          />
        </div>

        <div className="advisor-hero__content">
          <div className="advisor-hero__badge">
            <img src={logoManzana} alt="AnNutrición" />
            <span>Equipo AnNutrición</span>
          </div>

          <h1 className="advisor-hero__name">
            M.N.D. Alejandra Jocelyn Gómez Nava
          </h1>

          <p className="advisor-hero__role">
            Nutrióloga clínica&nbsp;· Nutrición deportiva
          </p>

          <p className="advisor-hero__experience">
            +7 años de experiencia profesional
          </p>

          <div className="advisor-hero__tags">
            <span className="tag">Nutrición clínica</span>
            <span className="tag">Salud femenina</span>
            <span className="tag">Nutrición pediátrica</span>
            <span className="tag">Nutrición deportiva</span>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="advisor-detail">
        <div className="advisor-detail__card advisor-detail__card--main">
          <h2>Sobre la asesora</h2>
          <p>
            Nutrióloga privada con amplia experiencia en nutrición comunitaria,
            área clínica, hospitalaria y de servicio de alimentos.
          </p>
          <p>
            Experiencia en el manejo de nutrición con enfoque en salud
            femenina, así como también atención para la nutrición pediátrica.
          </p>
          <p>
            Conocimiento en el área de nutrición y entrenamiento para el
            fitness, nutrición deportiva y su aplicación en diferentes deportes
            y contextos de acuerdo a las características, necesidades y
            objetivos de los atletas.
          </p>
          <p>
            Colaboradora en la planeación, logística y administración en eventos
            de nutrición académicos a nivel nacional e internacional.
          </p>
        </div>

        <div className="advisor-detail__grid">
          <article className="advisor-detail__card">
            <h3>Cédulas profesionales</h3>
            <ul className="advisor-detail__list">
              <li>Cédula profesional Licenciatura: 12405273</li>
              <li>Cédula profesional Maestría: 14760389</li>
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

export default Asesora;
