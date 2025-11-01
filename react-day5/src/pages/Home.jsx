import React from "react";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="container home-page">
      <header className="home-hero">
        <h1>🎟️ Welcome to Ticket Tracker</h1>
        <p className="tagline">
          A modern, lightweight React demo app that simulates how real
          engineering teams manage issue tracking using{" "}
          <strong>React Query</strong> and <strong>Context API</strong>.
        </p>
      </header>

      <section className="home-section">
        <h2>🧩 What is Ticket Tracker?</h2>
        <p>
          <strong>Ticket Tracker</strong> is a mini project designed to showcase
          how to build a **real-time, data-driven UI** using modern React
          patterns. You can create, update, and delete tickets just like
          developers handle bug reports or support requests in production apps.
        </p>
        <p>
          It demonstrates clean separation of concerns, efficient state
          management, and API synchronization using <strong>React Query</strong>{" "}
          — the same pattern adopted by companies like Vercel, Shopify, and
          Netflix.
        </p>
      </section>

      <section className="home-section">
        <h2>⚙️ Key Features</h2>
        <ul>
          <li>
            <strong>React Query</strong> — Handles API calls, caching, and
            background data updates automatically.
          </li>
          <li>
            <strong>Context API</strong> — Provides a global theme toggle for
            Light/Dark mode across all pages.
          </li>
          <li>
            <strong>Routing</strong> — Built with <code>react-router-dom</code>{" "}
            for smooth page transitions.
          </li>
          <li>
            <strong>Optimistic UI Updates</strong> — Experience real-time ticket
            creation and deletion before the backend confirms.
          </li>
          <li>
            <strong>Scalable Folder Structure</strong> — Organized for
            enterprise-level React apps.
          </li>
        </ul>
      </section>

      <section className="home-section">
        <h2>🚀 Getting Started</h2>
        <p>
          Use the <NavLink to="/tickets">Tickets</NavLink> page to explore how
          data fetching and mutation work in action.
        </p>
        <p>
          Each action you perform (add, edit, delete a ticket) is synchronized
          through <strong>React Query</strong>, updating the cache and UI
          seamlessly — this is the backbone of **real-world React apps**.
        </p>
      </section>

      <section className="home-section">
        <h2>💡 Learning Outcomes</h2>
        <ul>
          <li>Understand the difference between UI state and server state.</li>
          <li>
            Learn how React Query simplifies async logic and data caching.
          </li>
          <li>Use Context to manage app-wide themes and settings.</li>
          <li>Structure a React project the way production teams do.</li>
        </ul>
      </section>

      <section className="home-section">
        <h2>🏗️ Tech Stack</h2>
        <ul className="tech-list">
          <li>⚛️ React 18 + Hooks</li>
          <li>🔄 React Query (TanStack Query)</li>
          <li>🧭 React Router v6</li>
          <li>🎨 CSS3 with responsive design</li>
          <li>⚡ Vite for fast development</li>
        </ul>
      </section>

      <footer className="home-footer">
        <p>
          Built by <strong>Raj Prabhu Rajasekaran</strong> as part of a
          full-stack React learning roadmap. <br />
          Dive deeper on the{" "}
          <NavLink to="/about" className="link">
            About Page
          </NavLink>{" "}
          to learn the concepts behind this project.
        </p>
      </footer>
    </div>
  );
}
