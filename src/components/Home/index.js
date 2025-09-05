
import {Component} from 'react'
import {HiOutlineSearch} from 'react-icons/hi'
import {RiBuildingLine} from 'react-icons/ri'
import {IoMdLink} from 'react-icons/io'
import {IoLocationOutline} from 'react-icons/io5'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Header from '../Header'
import UsernameContext from '../../context/UsernameContext'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {searchInput: '', apiStatus: apiStatusConstants.initial, profile: null}

  onChangeInput = e => {
    this.setState({searchInput: e.target.value})
  }

  onSearch = async changeUserName => {
    const {searchInput} = this.state
    if (searchInput.trim() === '') {
      return
    }
    changeUserName(searchInput)
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiKey = process.env.REACT_APP_GITHUB_API_KEY
    const url = `https://apis2.ccbp.in/gpv/profile/${searchInput}?api_key=${apiKey}`
    try {
      const response = await fetch(url)
      if (response.ok) {
        const data = await response.json()
        this.setState({profile: data, apiStatus: apiStatusConstants.success})
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch (e) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="home-loader" data-testid="loader">
      <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
    </div>
  )

  renderFailure = () => (
    <div className="home-failure">
      <img
        src="https://res.cloudinary.com/ddsn9feta/image/upload/v1718604995/Group_7522_f4ueqy.png"
        alt="failure view"
        className="error-view"
      />
      <p>Something went wrong. Please try again</p>
    </div>
  )

  renderSuccess = () => {
    const {profile} = this.state
    const {
      name,
      avatar_url,
      login,
      bio,
      followers,
      following,
      public_repos,
      company,
      blog,
      location,
      title,
    } = profile

    return (
      <div className="home-success">
        <img src={avatar_url} alt={name} className="profile-avatar" />
        <h1>{name}</h1>
        <p>{login}</p>
        <p>BIO</p>
        <p>{bio}</p>

        <p>FOLLOWERS</p>
        <p>{followers}</p>

        <p>FOLLOWING</p>
        <p>{following}</p>

        <p>PUBLIC REPOS</p>
        <p>{public_repos}</p>

        <p>Company</p>
        <RiBuildingLine />
        <p>{company}</p>

        <p>Blog</p>
        <IoMdLink />
        <p>{blog}</p>

        <p>Location</p>
        <IoLocationOutline />
        <p>{location}</p>

        {title && <h1>{title}</h1>}
      </div>
    )
  }

  renderBody = changeUserName => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccess()
      case apiStatusConstants.failure:
        return self.renderFailure ? self.renderFailure() : this.renderFailure()
      case apiStatusConstants.inProgress:
        return self.renderLoader ? self.renderLoader() : this.renderLoader()
      default:
        return (
          <img
            src="https://res.cloudinary.com/ddsn9feta/image/upload/v1718331293/Frame_2_yyijhr.png"
            alt="github profile visualizer home page"
            className="home-hero"
          />
        )
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <UsernameContext.Consumer>
        {value => {
          const {changeUserName} = value
          return (
            <>
              <Header />
              <main className="home-container">
                <h1>GitHub Profile Visualizer</h1>
                <div className="search-bar">
                  <input
                    type="search"
                    value={searchInput}
                    onChange={this.onChangeInput}
                    placeholder="Search GitHub username"
                    className="search-input"
                  />
                  <button
                    type="button"
                    data-testid="searchButton"
                    className="search-button"
                    onClick={() => this.onSearch(changeUserName)}
                  >
                    <HiOutlineSearch />
                  </button>
                </div>
                <div className="home-content">{this.renderBody(changeUserName)}</div>
              </main>
            </>
          )
        }}
      </UsernameContext.Consumer>
    )
  }
}

export default Home
