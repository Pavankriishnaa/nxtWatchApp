import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'
import {CiLight} from 'react-icons/ci'
import {MdDarkMode} from 'react-icons/md'
import DataContext from '../../context/DataContext'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <DataContext.Consumer>
      {value => {
        const {dark, toggleTheme} = value
        const bgColor = dark ? '#212121' : '#ffffff'
        const logoUrl = dark
          ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-dark-theme-img.png'
          : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png'

        return (
          <nav className="nav-header" style={{backgroundColor: bgColor}}>
            <div className="nav-content">
              {/* LEFT: Logo */}
              <Link to="/">
                <img
                  src={logoUrl}
                  alt="website logo"
                  className="website-logo"
                />
              </Link>

              {/* RIGHT: Icons + Logout */}
              <ul className="nav-menu">
                <li>
                  <button
                    type="button"
                    data-testid="theme"
                    onClick={() => toggleTheme()}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {dark ? (
                      <CiLight size={30} color="white" />
                    ) : (
                      <MdDarkMode size={30} color="#181818" />
                    )}
                  </button>
                </li>

                <li>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
                    alt="profile"
                    className="profile-img"
                  />
                </li>

                <li>
                  <Popup
                    modal
                    trigger={
                      <button
                        type="button"
                        className="logout-btn"
                        style={{
                          color: dark ? '#ffffff' : '#3b82f6',
                          borderColor: dark ? '#ffffff' : '#3b82f6',
                        }}
                      >
                        Logout
                      </button>
                    }
                  >
                    {close => (
                      <div
                        className="popup-content"
                        style={{
                          backgroundColor: dark ? '#212121' : '#ffffff',
                        }}
                      >
                        <p style={{color: dark ? '#ffffff' : '#1e293b'}}>
                          Are you sure, you want to logout
                        </p>
                        <div className="popup-btns">
                          <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => close()}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            className="confirm-btn"
                            onClick={onClickLogout}
                          >
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}
                  </Popup>
                </li>
              </ul>
            </div>
          </nav>
        )
      }}
    </DataContext.Consumer>
  )
}

export default withRouter(Header)
