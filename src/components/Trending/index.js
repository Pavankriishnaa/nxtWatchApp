import {Component} from 'react'
import Cookies from 'js-cookie'
import {formatDistanceToNow} from 'date-fns'
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

class Trending extends Component {
  state = {
    videos: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingVideos()
  }

  getTrendingVideos = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const jwtToken = Cookies.get('jwt_token')
    const trendingVideosApiUrl = 'https://apis.ccbp.in/videos/trending'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(trendingVideosApiUrl, options)

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
        <img src={imgUrl} alt="failure view" />
        <h1>Oops! Something Went Wrong</h1>
        <p>We are having some trouble</p>
        <button type="button" onClick={this.getTrendingVideos}>
          Retry
        </button>
      </div>
    )
  }

  renderVideos = (videos, dark) => {
    const textColor = dark ? '#ffffff' : '#1e293b'

    return (
      <ul className="video-list">
        {videos.map(video => {
          const postedAt = formatDistanceToNow(new Date(video.publishedAt), {
            addSuffix: true,
          })

          return (
            <li key={video.id} className="video-item">
              <Link to={`/videos/${video.id}`} className="link-container">
                <img
                  src={video.thumbnailUrl}
                  alt="video thumbnail"
                  className="thumbnail"
                />
                <div className="video-details">
                  <p className="video-title" style={{color: textColor}}>
                    {video.title}
                  </p>
                  <p className="video-info">{video.channel.name}</p>
                  <p className="video-info">{video.viewCount} views</p>
                  <p className="video-info">{postedAt}</p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

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
            <div className="main-home-conatiner" data-testid="trending">
              <Header />
              <div className="navbar-content-container">
                <NavBar />
                <div
                  className={`content-container ${toMakeDark}`}
                  style={{backgroundColor: bgColor}}
                >
                  <h1 style={{color: dark ? '#ffffff' : '#1e293b'}}>
                    Trending
                  </h1>

                  {apiStatus === apiStatusConstants.loading &&
                    this.renderLoader()}
                  {apiStatus === apiStatusConstants.failure &&
                    this.renderFailureView(dark)}
                  {apiStatus === apiStatusConstants.success &&
                    this.renderVideos(videos, dark)}
                </div>
              </div>
            </div>
          )
        }}
      </DataContext.Consumer>
    )
  }
}

export default Trending
