import React from "react";
import { Statistic } from "antd";
import { injectIntl } from 'react-intl';
import messages from './messages';

const { Countdown } = Statistic;

class AutoRedirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.id = setTimeout(() => {
      window.location.href = this.props.url;
    }, this.props.delay);
    const deadline = Date.now() + this.props.delay;
    this.setState({
      deadline,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {
    const { deadline } = this.state;
    const { intl } = this.props;
    
    return (
      <>
        <Countdown
          title={intl.formatMessage(messages.texts.redirected, { timeLeft: this.props.delay / 1000 })}
          value={deadline}
        />
        {this.props.children}
      </>
    );
  }
}

export default injectIntl(AutoRedirect);
