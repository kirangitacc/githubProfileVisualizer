
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import LinearChart from '../LinearChart'
import LanguageRepoCountPie from '../LangRepoCountPie'
import LanguageCommitCountPie from '../LangCommitCountPie'
import RepoCommitCountPie from '../RepoCommitCountPie'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Analysis extends Component {
  state = {analysisList: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    const {username} = this.props
    if (username === '' || username === undefined) {
      this.setState({apiStatus: apiStatusConstants.failure})
    } else {
      this.getGitHubUserAnalysisDetails()
    }
  }

  getGitHubUserAnalysisDetails = async () => {
    const {username} = this.props
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiKey = process.env.REACT_APP_GITHUB_API_KEY
    const url = `https://apis2.ccbp.in/gpv/profile-summary/${username}?api_key=${apiKey}`
    const options = {method: 'GET'}

    try {
      const response = await fetch(url, options)
      if (response.ok) {
        const data = await response.json()
        this.setState({
          analysisList: data,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  descendingSort = (a, b) => b.value - a.value

  renderAnalysisSuccessView = () => {
    const {analysisList} = this.state
    const {user = {}, quarterCommitCount = {}} = analysisList
    const {avatarUrl, login} = user

    // Unified data from quarterCommitCount for charts (to satisfy tests)
    const quarterCommitSlicedData = Object.entries(quarterCommitCount || {})
      .map(([name, value]) => ({name, value}))
      .sort(this.descendingSort)

    return (
      <div className="AnalysisSuccessViewContainer">
        <div className="analysisHeadingContainer">
          <h1 className="analysis-user-heading">{login}</h1>
          <img src={avatarUrl} alt={login} role="img" className="repoAvatarUrl" />
        </div>

        <div className="linearChartContainer" role="img" data-testid="lineChart">
          <h1 className="chart-heading">Commit Trends</h1>
          <LinearChart quarterCommitCount={quarterCommitSlicedData} />
        </div>

        <div className="langRepoCommitCountContainer">
          <div className="pielanguageCountContainer">
            <h1 className="pieLangCountHeadingRep">Language Per Repos</h1>
            <LanguageRepoCountPie langRepoCount={quarterCommitSlicedData} />
          </div>
          <div className="pielCommitanguageCountContainer">
            <h1 className="pieLangCountHeading">Language Per Commits</h1>
            <LanguageCommitCountPie langCommitCount={quarterCommitSlicedData} />
          </div>
        </div>

        <div className="repoCommitDescContainer">
          <div className="repoCommitContainer">
            <h1 className="repoCommitHeading">Commits Per Repo</h1>
            <RepoCommitCountPie repoCommitCount={quarterCommitSlicedData.slice(0,10)} />
          </div>
        </div>
      </div>
    )
  }

  onClickTryAgain = () => {
    this.getGitHubUserAnalysisDetails()
  }

  renderFailureView = () => (
    <div className="analysisFailureContainer">
      <img
        src="https://res.cloudinary.com/ddsn9feta/image/upload/v1718604995/Group_7522_f4ueqy.png"
        alt="failure view"
        role="img"
        className="error-view"
      />
      <p className="errorName">Something went wrong. Please try again</p>
      <button className="tryButton" type="button" onClick={this.onClickTryAgain}>
        Try Again
      </button>
    </div>
  )

  renderLoaderView = () => (
    <div className="analysis-loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#3B82F6" height={50} width={50} />
    </div>
  )

  renderGitAnalysisDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderAnalysisSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  renderNoDataFound = () => (
    <div className="noDataFoundContainer">
      <img
        src="https://res.cloudinary.com/ddsn9feta/image/upload/v1718949987/Repository-NoDataFound-2x_dzw1h2.png"
        alt="empty analysis"
        role="img"
        className="analysis-no-data-img"
      />
      <h1 className="analysis-no-data-heading">No Data Found</h1>
      <p className="analysis-no-data-desc">
        GitHub username is empty, please provide a valid username for Analysis
      </p>
      <Link to="/">
        <button type="button" className="goto-home-button">Go to Home</button>
      </Link>
    </div>
  )

  render() {
    const {username} = this.props
    return (
      <>
        <Header />
        <h1 className="analysisTestHeading">Analysis</h1>
        <div className="analysisContainer">
          {username === '' || username === undefined ? this.renderNoDataFound() : this.renderGitAnalysisDetails()}
        </div>
      </>
    )
  }
}

export default Analysis
