
import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

class Header extends Component {
  render() {
    const currentPath = window.location.pathname
    return (
      <header className="app-header">
        <div className="header-inner">
          <h1 className="app-title">
            <Link to="/" className="title-link">
              GitHub Profile Visualizer
            </Link>
          </h1>

          <nav className="nav">
            <ul className="nav-items">
              <li>
                <Link
                  to="/"
                  className={
                    currentPath === '/' ? 'active-link item-nav-link' : 'item-nav-link'
                  }
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/repositories"
                  className={
                    currentPath === '/repositories'
                      ? 'active-link item-nav-link'
                      : 'item-nav-link'
                  }
                >
                  Repositories
                </Link>
              </li>
              <li>
                <Link
                  to="/analysis"
                  className={
                    currentPath === '/analysis'
                      ? 'active-link item-nav-link'
                      : 'item-nav-link'
                  }
                >
                  Analysis
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    )
  }
}

export default Header
