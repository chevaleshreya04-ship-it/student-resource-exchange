import React from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import './About.css'

const About = () => {
  return (
    <div>
      <NavBar />
      <main className="about-container">
        <h1>About Student Resource Exchange</h1>

        <section className="about-section">
          <h2>What is this?</h2>
          <p>
            Student Resource Exchange is a place for students to upload and
            browse academic materials — question papers, textbooks, research
            papers, and notes — all in one searchable spot.
          </p>
        </section>

        <section className="about-section">
          <h2>The problem</h2>
          <p>
            Most resource sharing happens informally, through WhatsApp groups,
            random Drive links, or forwarded PDFs. It works for a moment, but
            things get buried, links expire, and nobody can tell what's
            actually worth downloading. SRE keeps everything organized,
            searchable, and easy to find long after it was first shared.
          </p>
        </section>

        <section className="about-section">
          <h2>How it works</h2>
          <ol className="about-steps">
            <li>
              <strong>Browse or search</strong> — filter by subject,
              university, branch, semester, or type to find what you need.
            </li>
            <li>
              <strong>Upload</strong> — share your own notes, papers, or
              textbooks in a few clicks.
            </li>
            <li>
              <strong>Download</strong> — download counts double as a quality
              signal, so the most useful resources naturally rise to the top.
            </li>
          </ol>
        </section>

        <section className="about-section">
          <h2>Why I built this</h2>
          <p>
            This project was built solo as a MERN stack portfolio piece —
            React on the frontend, with Node, Express, and MongoDB powering
            the backend. I wanted to build something with a real, everyday
            problem behind it rather than another to-do app, and resource
            sharing among students felt like a natural fit.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About