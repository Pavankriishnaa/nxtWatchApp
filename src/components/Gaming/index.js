import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link, Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import NavBar from '../NavBar'
import DataContext from '../../context/DataContext'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Gaming extends Component {
  state = {
    videos: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getGamingVideos()
  }

  getGamingVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const jwtToken = Cookies.get('jwt_token')
    const gamingVideosApiUrl = 'https://apis.ccbp.in/videos/gaming'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(gamingVideosApiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const formattedData = data.videos.map(each => ({
        id: each.id,
        title: each.title,
        thumbnailUrl: each.thumbnail_url,
        viewCount: each.view_count,
      }))
      this.setState({
        videos: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#3b82f6" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We are having some trouble</p>
      <button type="button" onClick={this.getGamingVideos}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = videos => (
    <ul className="gaming-video-list">
      {videos.map(video => (
        <li key={video.id} className="gaming-video-item">
          <Link to={`/videos/${video.id}`} className="gaming-link">
            <img
              src={video.thumbnailUrl}
              alt="video thumbnail"
              className="gaming-thumbnail"
            />
            <p className="gaming-title">{video.title}</p>
            <p className="gaming-views">{video.viewCount} Watching Worldwide</p>
          </Link>
        </li>
      ))}
    </ul>
  )

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }

    const {videos, apiStatus} = this.state

    return (
      <DataContext.Consumer>
        {value => {
          const {dark} = value
          const toMakeDark = dark ? 'to-make-dark' : ''
          const bgColor = dark ? '#0f0f0f' : '#f9f9f9'

          return (
            <div className="main-home-conatiner" data-testid="gaming">
              <Header />
              <div className="navbar-content-container">
                <NavBar />
                <div
                  className={`content-container ${toMakeDark}`}
                  style={{backgroundColor: bgColor, minHeight: '100vh'}}
                >
                  <h1 style={{color: dark ? '#ffffff' : '#1e293b'}}>Gaming</h1>

                  {apiStatus === apiStatusConstants.loading &&
                    this.renderLoader()}
                  {apiStatus === apiStatusConstants.failure &&
                    this.renderFailureView()}
                  {apiStatus === apiStatusConstants.success &&
                    this.renderSuccessView(videos)}
                </div>
              </div>
            </div>
          )
        }}
      </DataContext.Consumer>
    )
  }
}

export default Gaming
