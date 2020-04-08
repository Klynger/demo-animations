import React, { Component } from 'react';

interface Props {
  test: string
}

export default class Test extends Component<Props> {
  componentDidUpdate(prevProps: Props) {
    console.log({ prevProps, props: this.props });
  }

  render() {
    const { test } = this.props;
    return (
      <div>
        Test prop {test}
      </div>
    );
  }
}
