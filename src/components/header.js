import React from 'react'
import { Link } from 'gatsby'

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: '#222',
    }}
  >
    <div
      style={{
        margin: '0 auto',
        maxWidth: 840,
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: '#FCFCFC',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>

      </h1>
    </div>
  </div>
)

export default Header
