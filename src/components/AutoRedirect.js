import React from "react";
import { injectIntl } from 'react-intl';
import messages from './messages';
import Countdown from './Countdown';

class AutoRedirect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.id = setTimeout(() => {
      window.location.href = this.props.url;
    }, this.props.delay);
  }

  componentWillUnmount() {
    clearTimeout(this.id);
  }

  render() {    
    return (
      <main>
        <div className='auto-redirect-statistic'>
          <Countdown
            redirect
            delay={this.props.delay}
          />
        </div>
          {
            this.props.children
          }
      </main>
    );
  }
}

export default AutoRedirect;
