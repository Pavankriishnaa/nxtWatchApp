import {Component} from 'react'
import {Switch, Route} from 'react-router-dom'

import DataContext from './context/DataContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './components/Home'
import Gaming from './components/Gaming'
import Trending from './components/Trending'
import SavedVideos from './components/SavedVideos'
import VideoItemDetails from './components/VideoItemDetails'
import NotFound from './components/NotFound'
import Login from './components/Login'

class App extends Component {
  state = {
    dark: false,
    isActiveBar: 'Home',
    savedVideos: [],
    likeDislikeList: [],
  }

  toggleTheme = () => {
    this.setState(prev => ({dark: !prev.dark}))
  }

  changeActiveBar = value => {
    this.setState({isActiveBar: value})
  }

  savedTheVideo = video => {
    this.setState(prev => {
      const exists = prev.savedVideos.find(v => v.id === video.id)
      if (exists) {
        return {savedVideos: prev.savedVideos.filter(v => v.id !== video.id)}
      }
      return {savedVideos: [...prev.savedVideos, video]}
    })
  }

  likeDislikeTheVideo = (id, status) => {
    this.setState(prev => {
      const exists = prev.likeDislikeList.find(v => v.id === id)
      if (exists) {
        return {
          likeDislikeList: prev.likeDislikeList.map(v =>
            v.id === id ? {id, status} : v,
          ),
        }
      }
      return {likeDislikeList: [...prev.likeDislikeList, {id, status}]}
    })
  }

  render() {
    const {dark, isActiveBar, savedVideos, likeDislikeList} = this.state

    return (
      <DataContext.Provider
        value={{
          dark,
          toggleTheme: this.toggleTheme,
          isActiveBar,
          changeActiveBar: this.changeActiveBar,
          savedVideos,
          savedTheVideo: this.savedTheVideo,
          likeDislikeList,
          likeDislikeTheVideo: this.likeDislikeTheVideo,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute exact path="/trending" component={Trending} />
          <ProtectedRoute exact path="/gaming" component={Gaming} />
          <ProtectedRoute
            exact
            path="/videos/:id"
            component={VideoItemDetails}
          />
          <ProtectedRoute exact path="/saved-videos" component={SavedVideos} />
          <Route component={NotFound} />
        </Switch>
      </DataContext.Provider>
    )
  }
}

export default App
