import { Layout } from "antd"

export default ({ children }) => {

  const { Header, Content, Footer } = Layout

  return (
    <Layout>
      <Header>Header </Header>
      <Content>{children}</Content>
      <Footer>
        Develop by lee
      </Footer>
    </Layout>
  )
}
