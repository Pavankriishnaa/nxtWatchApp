import React from 'react'

const DataContext = React.createContext({
  dark: false,
  isActiveBar: 'Home',
  changeActiveBar: () => {},
  toggleTheme: () => {},
  savedVideos: [],
  savedTheVideo: () => {},
  likeDislikeList: [],
  likeDislikeTheVideo: () => {},
})

export default DataContext
