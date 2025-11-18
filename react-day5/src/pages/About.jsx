import React from "react";

export default function About() {
  return (
    <div className="container about-page">
      <h2>About This Project</h2>
      <p>
        <strong>Ticket Tracker</strong> is a demo React application designed to
        showcase **modern React development practices** — specifically around
        state management, data fetching, and UI reactivity using{" "}
        <strong>React Query</strong>.
      </p>

      <section>
        <h3>🎯 Purpose</h3>
        <p>
          The goal of this project is to help developers understand how to build
          scalable, maintainable front-end applications that handle data
          efficiently. It demonstrates how to fetch, cache, and update data in
          real-time while keeping the UI in sync — all without writing a lot of
          boilerplate code.
        </p>
      </section>

      <section>
        <h3>⚙️ Key Concepts Covered</h3>
        <ul>
          <li>
            <strong>Queries</strong> – Fetching data from an API or database and
            managing the loading, error, and success states automatically.
          </li>
          <li>
            <strong>Mutations</strong> – Updating or creating new data (e.g.,
            adding or resolving tickets) with built-in state tracking.
          </li>
          <li>
            <strong>Optimistic Updates</strong> – Instantly reflecting changes
            in the UI before the server confirms them, giving a smoother user
            experience.
          </li>
          <li>
            <strong>Global Caching</strong> – Keeping API data consistent and
            fresh across multiple components using React Query’s intelligent
            cache.
          </li>
          <li>
            <strong>Dark / Light Mode</strong> – Theme toggling powered by React
            Context API.
          </li>
        </ul>
      </section>

      <section>
        <h3>🧱 Tech Stack</h3>
        <ul>
          <li>⚛️ React 18 (with Hooks & Context API)</li>
          <li>🔄 React Query for server-state management</li>
          <li>🧭 React Router for client-side routing</li>
          <li>🎨 CSS3 (custom responsive design)</li>
          <li>🧰 Vite – Lightning-fast development setup</li>
        </ul>
      </section>

      <section>
        <h3>🧠 Learning Outcomes</h3>
        <p>
          This project teaches core professional concepts every front-end
          engineer should know:
        </p>
        <ul>
          <li>Handling async data flow the React Query way</li>
          <li>Reducing re-renders and improving performance</li>
          <li>Structuring scalable React apps with context + hooks</li>
          <li>Designing user feedback through optimistic UI updates</li>
          <li>Building a consistent dark/light theme across routes</li>
        </ul>
      </section>

      <section>
        <h3>🚀 Future Enhancements</h3>
        <ul>
          <li>Integrate with a real REST or GraphQL API</li>
          <li>Add authentication using JWT or Firebase</li>
          <li>Role-based dashboard views (Admin / Developer)</li>
          <li>Attach file uploads or screenshots to tickets</li>
          <li>Unit & integration testing with Jest + React Testing Library</li>
        </ul>
      </section>

      <section>
        <h3>💬 Author’s Note</h3>
        <p>
          This demo is part of a structured React practice series designed to
          simulate real-world development challenges. Each “Day” builds on the
          previous one — evolving from basic components to production-grade
          patterns used in tech companies today.
        </p>
        <p>
          It’s an ideal sandbox for sharpening your React fundamentals, learning
          industry-grade patterns, and preparing for front-end developer
          interviews.
        </p>
      </section>
    </div>
  );
}
