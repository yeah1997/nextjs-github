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
  class withRedux extends React.Component {
    render({ component, pageProps, ...rest }) {
      return <HocComp component={component} pageProps={pageProps} {...rest} />;
    }
  }

  HocComp.getInitialProps = async (ctx) => {
    let appProps = {};
    if (typeof Comp.getInitialProps === "function") {
      appProps = await Comp.getInitialProps(ctx);
    }

    const reduxStore = getOrCreateStore();

    return {
      ...appProps,
      initialState: reduxStore.getState(),
    };
  };

  return withRedux;
};
