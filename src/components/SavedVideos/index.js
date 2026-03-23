import {Component} from 'react'
import {Link, Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import DataContext from '../../context/DataContext'
import Header from '../Header'
import NavBar from '../NavBar'
import './index.css'

class SavedVideos extends Component {
  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    return (
      <DataContext.Consumer>
        {value => {
          const {savedVideos, dark} = value
          const toMakeDark = dark ? 'to-make-dark' : ''
          const bgColor = dark ? '#0f0f0f' : '#f9f9f9'
          const textColor = dark ? '#ffffff' : '#1e293b'

          return (
            <div className="main-home-conatiner" data-testid="savedVideos">
              <Header />

              <div className="navbar-content-container">
                <NavBar />

                <div
                  className={`content-container ${toMakeDark}`}
                  style={{backgroundColor: bgColor}}
                >
                  {savedVideos.length === 0 ? (
                    <div className="no-saved-container">
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-saved-videos-img.png"
                        alt="no saved videos"
                        className="no-saved-img"
                      />
                      <h1 style={{color: textColor}}>No saved videos found</h1>
                      <p style={{color: '#64748b'}}>
                        Save your videos by clicking a button
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="saved-videos-banner">
                        <h1 style={{color: textColor}}>Saved Videos</h1>
                      </div>
                      <ul className="saved-video-list">
                        {savedVideos.map(video => (
                          <li key={video.id} className="saved-video-item">
                            <Link
                              to={`/videos/${video.id}`}
                              className="saved-link"
                              style={{color: 'inherit'}}
                            >
                              <img
                                src={video.thumbnailUrl}
                                alt="video thumbnail"
                                className="saved-thumbnail"
                              />
                              <div className="saved-video-details">
                                <p
                                  className="saved-title"
                                  style={{color: textColor}}
                                >
                                  {video.title}
                                </p>
                                <p className="saved-info">
                                  {video.channel.name}
                                </p>
                                <p className="saved-info">
                                  {video.viewCount} views
                                </p>
                                <p className="saved-info">
                                  {video.publishedAt}
                                </p>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        }}
      </DataContext.Consumer>
    )
  }
}

export default SavedVideos
