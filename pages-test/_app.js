import App, { Container } from "next/app";
import { Provider } from "react-redux";
import Layout from "../components/Layout";
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
    const { Component, pageProps, reduxStore } = this.props;

    return (
      <Container>
        <Layout>
          <Provider store={reduxStore}>
            <Component {...pageProps} />
          </Provider>
        </Layout>
      </Container>
    );
  }
}

export default MyApp;
