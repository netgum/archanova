import React, { Component } from 'react';
import { SdkContext } from './SdkContext';

export class SdkProvider extends Component {
  render() {
    const { sdk, children } = this.props;
    return (
      <SdkContext.Provider value={{ sdk }}>{children}</SdkContext.Provider>
    );
  }
}
