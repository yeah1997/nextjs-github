import { Layout, Icon, Input,Avatar } from "antd"
import { useCallback, useState } from "react"

export default ({ children }) => {
  const { Header, Content, Footer } = Layout
  const [search, setSearch] = useState("")

  const githubStyle = {
    display: "block",
    color: 'white',
    fontSize: "30px",
    marginRight: "20px"
  }

  const footerStyle = {
    textAlign: "center"
  }

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
  }, [setSearch])

  const handleOnSearch = useCallback(() => {

  })

  return (
    <Layout>
      <Header>
        <div className="header-inner">
          <div className="header-left">
            <div className="logo">
              <Icon type="github" style={githubStyle} />
            </div>
            <div>
              <Input.Search
                placeholder="To Search"
                value={search}
                onChange={handleSearchChange}
                onSearch={handleOnSearch}
              />
            </div>
          </div>
          <div className="header-right">
            <div className="user">
              <Avatar size={40} icon="user"/>
            </div>
          </div>
        </div>
      </Header>
      <Content>{children}</Content>
      <Footer style={footerStyle}>
        Develop by lee @
        <a href="mailto:lee7778889@gmail.com">lee7778889@gmail.com</a>
      </Footer>

      {/* css */}
      <style jsx>{`
        .header-inner {
          display: flex;
          justify-content: space-between;
        }
        .header-left {
          display: flex;
          justify-content: flex-start;
        }
        .header-left .logo {
          margin: auto
        }
      `}
      </style>

      <style jsx global>{`
        #__next {
          height: 100%;
        }
        .ant-layout {
          height: 100%;
        }
      `}
      </style>
    </Layout>
  )
}
