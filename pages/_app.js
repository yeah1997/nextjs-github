import App, { Container } from "next/app";
import { Provider } from "react-redux";
import store from "../store/store";
import MyContext from "../lib/my-context";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps;
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {
      pageProps,
    };
  }

  return() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Provider store={store}>
          <MyContext.Provider value="test">
            <Component {...pageProps} />
          </MyContext.Provider>
        </Provider>
      </Container>
    );
  }
}

export default MyApp;
