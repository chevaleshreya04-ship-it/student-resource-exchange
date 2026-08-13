import React from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'
 
const Hero = () => {
  return (
    <section className='hero-container'>
      <div className="hero-headings">
        <h1>Find the right notes, <br /> faster.</h1>
        <h3>Upload, search, and download study resources shared by students like you.</h3>
      </div>
      <div>
        <Link to="/browse" className="hero-cta">Browse Resources</Link>
      </div>
    </section>
  )
}

export default Hero