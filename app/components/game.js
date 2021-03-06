import React from 'react';
import PropTypes from 'prop-types';
import Header from '../components/header';
import { Link } from 'react-router-dom';
import StarRatingComponent from 'react-star-rating-component';
import '../stylesheets/game.scss';

class Game extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <tr>
        <td><img className='game-image' src={ this.props.data.game.image }/></td>
        <td>{ this.props.data.game.name }</td>
        <td><StarRatingComponent editing={ false } starCount={ 5 } value={ this.props.data.game.rating } name={ 'rating' }/></td>
        <td><Link to={ '/start-match' }><img className='play-button animated pulse' src={ require('../../assets/images/play_button.png') }/></Link></td>
      </tr>
    )
  }
}

Game.propTypes = {
  data: PropTypes.object
}

export default Game;
