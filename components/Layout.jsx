import { Layout, Icon, Input, Avatar, Tooltip, Dropdown, Menu } from "antd"
import { useCallback, useState } from "react"
import { connect } from "react-redux"
import { withRouter } from "next/router"

import Container from "./Container"
import getConfig from "next/config"
import { signOut } from "../store/store"
import axios from "axios"

const { publicRuntimeConfig } = getConfig()

function MyLayout ({ children, user, signOut, router })  {
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

  const handleOnSearch = useCallback(() => { })

  const handleSignOut = useCallback(() => {
    signOut()
  }, [signOut])

  const userDropDown = (
    <Menu>
      <Menu.Item key="1">
        <a href="javascript:void(0)" onClick={handleSignOut}>Sign out</a>
      </Menu.Item>
    </Menu>
  )

  return (
    <Layout>
      <Header>
        <Container renderer={<div className="header-inner" />}>
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
              {user && user.id ? (
                <Dropdown overlay={userDropDown}>
                  <a href="/">
                    <Avatar size={40} src={user.avatar_url} />
                  </a>
                </Dropdown>

                ) : (
                  <Tooltip title="Click to Login">
                    <a href={`/prepare-auth?url=${router.asPath}`}>
                      <Avatar size={40} icon="user" />
                    </a>
                  </Tooltip>
                )
              }
            </div>
          </div>
        </Container>
      </Header>
      <Content>
        <Container>{children}</Container>
      </Content>
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
        .ant-layout-header {
          padding: 0;
        }
      `}
      </style>
    </Layout>
  )
}

export default connect(function mapState(state) {
  return {
     user: state.user
   }
}, function mapReducer(dispatch) {
  return {
    signOut: ()=>dispatch(signOut())
  }
})(withRouter(MyLayout))
