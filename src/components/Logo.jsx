import React from 'react'
import logo from '../assets/logo.jpg'

/**
 * A component for displaying the logo of the website.
 * Returns an <img> element pointing to the logo image.
 * @function
 * @returns {ReactElement} The JSX element of the logo.
 */
const Logo = () => {
  return (
    <img src={logo} />
  )
}

export default Logo