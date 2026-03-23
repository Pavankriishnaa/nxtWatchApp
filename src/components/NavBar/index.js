import {Component} from 'react'
import {NavLink} from 'react-router-dom'
import {MdOutlinePlaylistAdd} from 'react-icons/md'
import {FaHome, FaFire} from 'react-icons/fa'
import {SiYoutubegaming} from 'react-icons/si'
import DataContext from '../../context/DataContext'
import './index.css'

class NavBar extends Component {
  render() {
    return (
      <DataContext.Consumer>
        {value => {
          const {isActiveBar, changeActiveBar, dark} = value

          const getLinkDetails = id => {
            const isActive = isActiveBar === id
            let itemClass = 'side-bar-item'
            let iconClass = dark ? 'icon-dark' : 'icon-light'
            let textClass = dark ? 'text-dark' : 'text-light'

            if (isActive) {
              itemClass += dark ? ' bg-dark-active' : ' active-background'
              iconClass = 'active-icon'
              textClass = dark ? 'dark-active-text' : 'active-bar'
            }

            return {itemClass, iconClass, textClass}
          }

          const home = getLinkDetails('Home')
          const trending = getLinkDetails('Trending')
          const gaming = getLinkDetails('Gaming')
          const saved = getLinkDetails('Saved')

          return (
            <div
              className={
                dark ? 'side-bar-container dark' : 'side-bar-container'
              }
            >
              <ul
                className="nav-items-list"
                style={{listStyleType: 'none', padding: '0px', margin: '0px'}}
              >
                <li key="home">
                  <NavLink
                    exact
                    to="/"
                    onClick={() => changeActiveBar('Home')}
                    className={home.itemClass}
                    style={{textDecoration: 'none'}}
                  >
                    <FaHome size={22} className={home.iconClass} />
                    <p className={home.textClass}>Home</p>
                  </NavLink>
                </li>

                <li key="trending">
                  <NavLink
                    to="/trending"
                    onClick={() => changeActiveBar('Trending')}
                    className={trending.itemClass}
                    style={{textDecoration: 'none'}}
                  >
                    <FaFire size={22} className={trending.iconClass} />
                    <p className={trending.textClass}>Trending</p>
                  </NavLink>
                </li>

                <li key="gaming">
                  <NavLink
                    to="/gaming"
                    onClick={() => changeActiveBar('Gaming')}
                    className={gaming.itemClass}
                    style={{textDecoration: 'none'}}
                  >
                    <SiYoutubegaming size={22} className={gaming.iconClass} />
                    <p className={gaming.textClass}>Gaming</p>
                  </NavLink>
                </li>

                <li key="saved">
                  <NavLink
                    to="/saved-videos"
                    onClick={() => changeActiveBar('Saved')}
                    className={saved.itemClass}
                    style={{textDecoration: 'none'}}
                  >
                    <MdOutlinePlaylistAdd
                      size={22}
                      className={saved.iconClass}
                    />
                    <p className={saved.textClass}>Saved videos</p>
                  </NavLink>
                </li>
              </ul>

              {/* CONTACT US SECTION */}
              <div className="contact-us-container">
                <p className={dark ? 'text-dark' : 'text-light'}>CONTACT US</p>
                <div className="icons-container">
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png"
                    alt="facebook logo"
                    style={{width: '30px'}}
                  />
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png"
                    alt="twitter logo"
                    style={{width: '30px'}}
                  />
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png"
                    alt="linked in logo"
                    style={{width: '30px'}}
                  />
                </div>
                <p className={dark ? 'text-dark' : 'text-light'}>
                  Enjoy! Now to see your channels and recommendations!
                </p>
              </div>
            </div>
          )
        }}
      </DataContext.Consumer>
    )
  }
}

export default NavBar
