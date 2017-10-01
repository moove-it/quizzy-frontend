import React from 'react';
import '../stylesheets/answer-question.scss';
import { Button } from 'react-bootstrap';

class AnswerButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.revealStyle = this.revealStyle.bind(this);
   }

  revealStyle(answered, correct) {
    if (answered !== false) { // 'if (answered)' is false for answered === 0, what is not desired
      if (correct) {
        return {
          backgroundColor: '#2ECC40'
        };
      } else if (answered === this.props.id) {
        return {
          backgroundColor: '#A90000'
        };
      }
    }
  }
  render() {
    return (
      <Button
        onClick={ this.props.onClick }
        style={ this.revealStyle(this.props.answered, this.props.correct) }
        disabled={ this.props.answered !== false }
      >
        { this.props.text }
      </Button>
    )
  }
}


AnswerButton.defaultProps = {
  correct: false
};

export default AnswerButton;
