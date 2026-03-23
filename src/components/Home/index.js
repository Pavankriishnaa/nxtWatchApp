import {Component} from 'react'
import Cookies from 'js-cookie'
import {CiSearch} from 'react-icons/ci'
import {IoIosClose} from 'react-icons/io'
import {formatDistanceToNow} from 'date-fns'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import DataContext from '../../context/DataContext'
import Header from '../Header'
import NavBar from '../NavBar'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Home extends Component {
  state = {
    bannerHide: false,
    searchInput: '',
    videos: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVideos()
  }

  toCloseBanner = () => {
    this.setState({bannerHide: true})
  }

  onchangeText = event => {
    this.setState({searchInput: event.target.value})
  }

  getVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state

    const homeVideosApiUrl = `https://apis.ccbp.in/videos/all?search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(homeVideosApiUrl, options)
      if (response.ok) {
        const data = await response.json()
        const formattedData = data.videos.map(each => ({
          id: each.id,
          title: each.title,
          thumbnailUrl: each.thumbnail_url,
          viewCount: each.view_count,
          publishedAt: each.published_at,
          channel: {
            name: each.channel.name,
            profileImageUrl: each.channel.profile_image_url,
          },
        }))

        this.setState({
          videos: formattedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#3b82f6" height="50" width="50" />
    </div>
  )

  renderFailureView = dark => {
    const imgUrl = dark
      ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-dark-theme-img.png'
      : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view-light-theme-img.png'

    return (
      <div className="failure-container">
        <img src={imgUrl} alt="failure view" className="failure-img" />
        <h1 className="failure-heading">Oops! Something Went Wrong</h1>
        <p className="failure-description">We are having some trouble</p>
        <button type="button" className="retry-button" onClick={this.getVideos}>
          Retry
        </button>
      </div>
    )
  }

  renderVideos = (videos, dark) => {
    if (videos.length === 0) {
      return (
        <div className="no-videos-view">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
            alt="no videos"
            className="no-videos-img"
          />
          <h1 className="no-videos-heading">No Search results found</h1>
          <p className="no-videos-description">
            Try different key words or remove search filter
          </p>
          <button
            type="button"
            className="retry-button"
            onClick={this.getVideos}
          >
            Retry
          </button>
        </div>
      )
    }

    return (
      <ul className="video-items-container">
        {videos.map(video => {
          const timeAgo = formatDistanceToNow(new Date(video.publishedAt), {
            addSuffix: true,
          })
          const textColor = dark ? '#ffffff' : '#1e293b'

          return (
            <li className="link-main-containers" key={video.id}>
              <Link to={`/videos/${video.id}`} className="link-containers">
                <img
                  src={video.thumbnailUrl}
                  alt="video thumbnail"
                  className="thumbnail-imgs"
                />
                <div className="video-meta">
                  <img
                    src={video.channel.profileImageUrl}
                    alt="channel logo"
                    className="channel-logo-small"
                  />
                  <div>
                    <p className="video-title" style={{color: textColor}}>
                      {video.title}
                    </p>
                    <p className="channel-name">{video.channel.name}</p>
                    <p className="views-date">
                      {video.viewCount} views • {timeAgo}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    const {bannerHide, searchInput, videos, apiStatus} = this.state

    return (
      <DataContext.Consumer>
        {value => {
          const {dark} = value
          const bgColor = dark ? '#181818' : '#f9f9f9'

          return (
            <div
              className="main-home-conatiner"
              data-testid="home"
              style={{backgroundColor: bgColor, minHeight: '100vh'}}
            >
              <Header />
              <div className="navbar-content-container">
                <NavBar />
                <div className="content-container">
                  {/* BANNER */}
                  {!bannerHide && (
                    <div
                      className="bannerX"
                      data-testid="banner"
                      style={{
                        backgroundImage: `url('https://assets.ccbp.in/frontend/react-js/nxt-watch-banner-bg.png')`,
                        backgroundSize: 'cover',
                      }}
                    >
                      <div className="banner-header">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
                          alt="nxt watch logo"
                          style={{width: '150px'}}
                        />
                        <button
                          type="button"
                          data-testid="close"
                          className="close-btn"
                          onClick={this.toCloseBanner}
                        >
                          <IoIosClose size={28} />
                        </button>
                      </div>
                      <p>Buy Nxt Watch Premium prepaid plans with UPI</p>
                      <button type="button" className="get-it-now-btn">
                        GET IT NOW
                      </button>
                    </div>
                  )}

                  {/* SEARCH + VIDEOS */}
                  <div className="home-content">
                    <div className="search-container">
                      <input
                        type="search"
                        placeholder="Search"
                        value={searchInput}
                        onChange={this.onchangeText}
                        className="search-input"
                        style={{
                          backgroundColor: dark ? '#212121' : '#ffffff',
                          color: dark ? '#ffffff' : '#1e293b',
                          borderColor: dark ? '#616e7c' : '#cbd5e1',
                        }}
                      />
                      <button
                        type="button"
                        data-testid="searchButton"
                        className="search-button"
                        onClick={this.getVideos}
                        style={{
                          backgroundColor: dark ? '#383838' : '#e2e8f0',
                          borderColor: dark ? '#616e7c' : '#cbd5e1',
                          color: dark ? '#ffffff' : '#1e293b',
                        }}
                      >
                        <CiSearch size={20} />
                      </button>
                    </div>

                    {apiStatus === apiStatusConstants.loading &&
                      this.renderLoader()}
                    {apiStatus === apiStatusConstants.failure &&
                      this.renderFailureView(dark)}
                    {apiStatus === apiStatusConstants.success &&
                      this.renderVideos(videos, dark)}
                  </div>
                </div>
              </div>
            </div>
          )
        }}
      </DataContext.Consumer>
    )
  }
}

export default Home
