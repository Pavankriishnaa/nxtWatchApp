/* eslint-disable jsx-a11y/media-has-caption */
import {Component} from 'react'
import {formatDistanceToNow} from 'date-fns'
import Cookies from 'js-cookie'
import {AiOutlineLike, AiOutlineDislike} from 'react-icons/ai'
import {MdPlaylistAdd} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'

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

class VideoItemDetails extends Component {
  state = {
    videoDetails: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  getVideoDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const {match} = this.props
    const {id} = match.params

    const jwtToken = Cookies.get('jwt_token')

    const response = await fetch(`https://apis.ccbp.in/videos/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      const video = data.video_details

      const formatted = {
        id: video.id,
        title: video.title,
        videoUrl: video.video_url,
        thumbnailUrl: video.thumbnail_url,
        viewCount: video.view_count,
        publishedAt: video.published_at,
        description: video.description,
        channel: {
          name: video.channel.name,
          profileImageUrl: video.channel.profile_image_url,
          subscriberCount: video.channel.subscriber_count,
        },
      }

      this.setState({
        videoDetails: formatted,
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
        <img src={imgUrl} alt="failure view" className="failure-img" />
        <h1>Oops! Something Went Wrong</h1>
        <p>We are having some trouble</p>
        <button type="button" onClick={this.getVideoDetails}>
          Retry
        </button>
      </div>
    )
  }

  renderSuccessView = (videoDetails, contextValue) => {
    const {
      savedVideos,
      savedTheVideo,
      likeDislikeList,
      likeDislikeTheVideo,
      dark,
    } = contextValue

    const existing = likeDislikeList.find(v => v.id === videoDetails.id)

    const isLiked = existing?.status === 'LIKE'
    const isDisliked = existing?.status === 'DISLIKE'
    const isSaved = savedVideos.some(v => v.id === videoDetails.id)

    const timeAgo = formatDistanceToNow(new Date(videoDetails.publishedAt), {
      addSuffix: true,
    })

    const activeColor = '#2563eb'
    const inactiveColor = '#64748b'
    const textColor = dark ? '#ffffff' : '#1e293b'

    return (
      <div className="video-details-container">
        <ReactPlayer url={videoDetails.videoUrl} controls width="100%" />

        <p className="video-detail-title" style={{color: textColor}}>
          {videoDetails.title}
        </p>

        <div className="video-meta-row">
          <p className="video-stats" style={{color: inactiveColor}}>
            {videoDetails.viewCount} views • {timeAgo}
          </p>

          <div className="actions-container">
            {/* LIKE */}
            <button
              type="button"
              className="action-button"
              style={{
                border: '0px',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                color: isLiked ? activeColor : inactiveColor,
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onClick={() => likeDislikeTheVideo(videoDetails.id, 'LIKE')}
            >
              <AiOutlineLike size={22} />
              <span style={{marginLeft: '6px'}}>Like</span>
            </button>

            {/* DISLIKE */}
            <button
              type="button"
              className="action-button"
              style={{
                border: '0px',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                color: isDisliked ? activeColor : inactiveColor,
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onClick={() => likeDislikeTheVideo(videoDetails.id, 'DISLIKE')}
            >
              <AiOutlineDislike size={22} />
              <span style={{marginLeft: '6px'}}>Dislike</span>
            </button>

            {/* SAVE */}
            <button
              type="button"
              className="action-button"
              style={{
                border: '0px',
                backgroundColor: 'transparent',
                display: 'flex',
                alignItems: 'center',
                color: isSaved ? activeColor : inactiveColor,
                cursor: 'pointer',
                fontSize: '16px',
              }}
              onClick={() => savedTheVideo(videoDetails)}
            >
              <MdPlaylistAdd size={22} />
              <span style={{marginLeft: '6px'}}>
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </button>
          </div>
        </div>

        <hr style={{borderColor: dark ? '#383838' : '#e2e8f0'}} />

        <div className="channel-box">
          <img
            src={videoDetails.channel.profileImageUrl}
            alt="channel logo"
            className="channel-logo"
          />
          <div>
            <p style={{color: textColor, margin: '0 0 4px 0'}}>
              {videoDetails.channel.name}
            </p>
            <p style={{color: inactiveColor, margin: '0 0 12px 0'}}>
              {videoDetails.channel.subscriberCount} subscribers
            </p>
            <p style={{color: textColor}}>{videoDetails.description}</p>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {apiStatus, videoDetails} = this.state

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
                  className={`content-container ${toMakeDark}`}
                  style={{backgroundColor: bgColor}}
                >
                  {apiStatus === apiStatusConstants.loading &&
                    this.renderLoader()}

                  {apiStatus === apiStatusConstants.failure &&
                    this.renderFailureView(dark)}

                  {apiStatus === apiStatusConstants.success &&
                    this.renderSuccessView(videoDetails, value)}
                </div>
              </div>
            </div>
          )
        }}
      </DataContext.Consumer>
    )
  }
}

export default VideoItemDetails
