import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer-container'>
        <Link to="/about">About</Link>
        <a href="https://github.com/chevaleshreya04-ship-it" target="_blank" rel="noopener noreferrer">GitHub</a>
    </footer>
  )
}

export default Footer