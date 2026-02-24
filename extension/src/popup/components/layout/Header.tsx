import React from 'react'
import './Header.css'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-inner">

        <div className="logo-block">
          <img src="/icons/icon48.png" alt="LinkGuard" />
          <div className="logo-text">
            <span className="brand">LINKGUARD</span>
            <span className="tag">security console</span>
          </div>
        </div>

        <div className="status-block">
          <span className="status-dot active" />
          <span className="status-text">PROTECTED</span>
        </div>

      </div>
    </header>
  )
}

export default Header
