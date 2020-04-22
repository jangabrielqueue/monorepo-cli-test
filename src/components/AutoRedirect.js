import React from "react";
import Countdown from './Countdown';
import styled from 'styled-components';

const StyledRedirectContainer = styled.div`
  padding: 0 15px;
`;

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
        <StyledRedirectContainer>
          <Countdown
            redirect
            delay={this.props.delay}
          />
        </StyledRedirectContainer>
          {
            this.props.children
          }
      </main>
    );
  }
}

export default AutoRedirect;
