import React from "react";
import createStore from "../store/store";

const isServer = typeof window === "undefined";
const __NEXT_REDUX_STORE_ = "__NEXT_REDUX_STORE_";

function getOrCreateStore(initialState) {
  if (isServer) {
    return createStore(initialState);
  }

  if (!window[__NEXT_REDUX_STORE_]) {
    window[__NEXT_REDUX_STORE_] = createStore(initialState);
  }

  return window[__NEXT_REDUX_STORE_];
}

export default (Comp) => {
  class WithReduxApp extends React.Component {
    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }
    render() {
      const { component, pageProps, ...rest } = this.props;
      return (
        <Comp
          component={component}
          pageProps={pageProps}
          reduxStore={this.reduxStore}
          {...rest}
        />
      );
    }
  }

  WithReduxApp.getInitialProps = async (ctx) => {
    let reduxStore;
    const session = ctx.ctx.req.session;

    if (isServer && session && session.userInfo) {
      reduxStore = getOrCreateStore({ user: session.userInfo });
    } else {
      reduxStore = getOrCreateStore();
    }

    ctx.reduxStore = reduxStore;
    let appProps = {};

    if (typeof Comp.getInitialProps === "function") {
      appProps = await Comp.getInitialProps(ctx);
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    };
  };

  return WithReduxApp;
};
