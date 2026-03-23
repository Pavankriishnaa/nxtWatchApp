import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showPassword: false,
    errorMsg: '',
    isError: false,
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    if (username === '') {
      this.setState({isError: true, errorMsg: 'Please enter a valid username'})
      return
    }
    if (password === '') {
      this.setState({isError: true, errorMsg: 'Please enter a valid password'})
      return
    }

    const loginApiUrl = 'https://apis.ccbp.in/login'
    const response = await fetch(loginApiUrl, {
      method: 'POST',
      body: JSON.stringify({username, password}),
    })
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.setState({isError: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, showPassword, isError, errorMsg} = this.state
    if (Cookies.get('jwt_token') !== undefined) return <Redirect to="/" />

    return (
      <div className="login-container">
        <form className="login-box" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-watch-logo-light-theme-img.png"
            alt="website logo"
            className="logo-image"
          />

          <div className="input-container">
            <label htmlFor="username">USERNAME</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => this.setState({username: e.target.value})}
            />
          </div>

          <div className="input-container">
            <label htmlFor="password">PASSWORD</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => this.setState({password: e.target.value})}
            />
          </div>

          <div className="show-password-container">
            <input
              id="checkbox"
              type="checkbox"
              checked={showPassword}
              onChange={() =>
                this.setState(prev => ({showPassword: !prev.showPassword}))
              }
            />
            <label htmlFor="checkbox">Show Password</label>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
          {isError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
