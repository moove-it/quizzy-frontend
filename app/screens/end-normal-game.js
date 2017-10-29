import React, { PropTypes } from 'react';
import LoginModal from '../components/login-modal';
import RegisterModal from '../components/register-modal';
import { Button, ButtonToolbar, Jumbotron, ListGroup, ListGroupItem, Table, Modal, FormGroup, Col,
        FormControl, Checkbox, Form, ControlLabel } from 'react-bootstrap';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import '../stylesheets/end-normal-game.scss';
import { findIndex } from 'underscore';
import matchService from '../services/match';

const mapStateToProps = state => {
  return {
    matchData: state.matchData
  }
}

class EndNormalGame extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setModalSignIn = this.setModalSignIn.bind(this);
    this.setModalSignUp = this.setModalSignUp.bind(this);
    this.setModalHide = this.setModalHide.bind(this);
    this.renderRanking = this.renderRanking.bind(this);
    this.renderHeaderRanking = this.renderHeaderRanking.bind(this);
    this.greaterOrEqual = this.greaterOrEqual.bind(this);
    this.userPosition = -1;
    this.state = {
      showModal: 'hide',
      ranking: [],
    };
  }

  componentWillMount() {
    this.updateRanking();
  }

  setModalSignIn() {
    this.setState({ showModal: 'signIn' });
  }

  setModalSignUp() {
    this.setState({ showModal: 'signUp' });
  }

  setModalHide() {
    this.setState({ showModal: 'hide' });
  }

  updateRanking = () => {
    if (this.props.matchData.state.player !== '') {
      matchService.rankingInsert(this.props.matchData.match.id, this.props.matchData.state.player, this.props.matchData.state.score)
      .then((res) => {
        this.setState({ ranking: res.data })
      })
      .catch((err) => {
        console.log(err);
      });        
    }
  }

  greaterOrEqual(item) {
    return this.props.matchData.state.score >= item.points;
  }

  addItemtoRanking(items, i) {
    items.push(
      (i === this.userPosition) ? (
      <tr className='current-player' key={ i }>
        <td>{ i + 1 }</td>
        <td>{ this.state.ranking[i].user }</td>
        <td>{ this.state.ranking[i].points }</td>
      </tr>
      ) : (
        <tr key={ i }>
          <td>{ i + 1 }</td>
          <td>{ this.state.ranking[i].user }</td>
          <td>{ this.state.ranking[i].points }</td>
        </tr>
      )
    )
  }

  renderRanking() {
    let items = [];
    const lastIndex = this.state.ranking.length - 1;
    if (lastIndex >= 0) {

      let userPosition = this.state.ranking.findIndex(this.greaterOrEqual);
      if (userPosition === -1) {
        userPosition = this.state.ranking.length;
      }
      this.userPosition = userPosition;
      let first;
      let until;
      if (lastIndex <= 4) {
        //show until 5 users starting from 0
        first = 0;
        until = lastIndex;
      } else {
        //if current user is in first place or second one
        if (this.userPosition === 0 || this.userPosition === 1) {
          //show 5 starting from 0
          first = 0;
          until = 4;
        } else {
          //if current user is the last or previous than last
          if (this.userPosition === lastIndex || this.userPosition === lastIndex - 1) {
            //show 5 starting from lastIndex - 4
            first = lastIndex - 4;
            until = lastIndex;
          } else {
            //current user is in the middle
            first = this.userPosition - 2;
            until = this.userPosition + 2;
          }
        }
      }
      let i;
      for (i = first; i <= until; i++) {
        this.addItemtoRanking(items, i);
      }
    }
    return (<tbody>{items}</tbody>);
  }

  renderHeaderRanking() {
    return (
      <thead>
        <tr>
          <th>Place</th>
          <th>Player</th>
          <th>Points</th>
        </tr>
      </thead>
    );
  }

  render() {
    const score = this.props.matchData.state.score;
    return (
      <div className='container'>
        <Jumbotron className='margin-jumbotron'>
          <h1>Your final score is { score }!</h1>
          <p>Would you like to save your score to compete with other players?</p>
          <p>
            <Button bsStyle='success' onClick={ () => this.setModalSignIn() }>
              Save
            </Button>
            <Link to={ '/' }>
              <Button bsStyle='link'>
                Continue with your nickname
              </Button>
            </Link>
          </p>
        </Jumbotron>
        <LoginModal
          show={ this.state.showModal }
          setSignUp={ this.setModalSignUp }
          setHide={ this.setModalHide }
        />
        <RegisterModal
          show={ this.state.showModal }
          setSignIn={ this.setModalSignIn }
          setHide={ this.setModalHide }
        />
        <h2>Leaderboard</h2>
        <Table responsive>
          { this.renderHeaderRanking() }
          { this.renderRanking() }
        </Table>
      </div>
    )
  }
}

EndNormalGame.propTypes = {
  matchData: PropTypes.object,
}

export default connect(mapStateToProps)(EndNormalGame)
