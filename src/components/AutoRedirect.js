import React from "react";
import { Statistic } from "antd";

const { Countdown } = Statistic;

export class AutoRedirect extends React.Component {
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
    return (
      <>
        <Countdown
          title={`you will be redirected in ${this.props.delay / 1000} seconds`}
          value={deadline}
        />
        {this.props.children}
      </>
    );
  }
}
