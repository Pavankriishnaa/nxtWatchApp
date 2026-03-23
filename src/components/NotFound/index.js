import {Component} from 'react'
import Header from '../Header'
import NavBar from '../NavBar'
import DataContext from '../../context/DataContext'
import './index.css'

class NotFound extends Component {
  render() {
    return (
      <DataContext.Consumer>
        {value => {
          const {dark} = value
          const toMakeDark = dark ? 'to-make-dark' : ''
          const bgColor = dark ? '#0f0f0f' : '#f9f9f9'

          return (
            <div className="main-home-conatiner">
              <Header />

              <div className="navbar-content-container">
                <NavBar />

                <div
                  className={`content-container not-found-box ${toMakeDark}`}
                  style={{backgroundColor: bgColor}}
                >
                  <img
                    src={
                      dark
                        ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-dark-theme-img.png'
                        : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png'
                    }
                    alt="not found"
                    className="not-found-image"
                  />

                  <h1 className="not-found-title">Page Not Found</h1>

                  <p className="not-found-desc">
                    we are sorry, the page you requested could not be found.
                  </p>
                </div>
              </div>
            </div>
          )
        }}
      </DataContext.Consumer>
    )
  }
}

export default NotFound
