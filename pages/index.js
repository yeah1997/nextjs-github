import { Button, Icon, Tabs } from "antd";
import getConfig from "next/config";
import { useEffect } from "react";
import { connect } from "react-redux";

import Router, { withRouter } from "next/router";
import Repo from "../components/Repo";

const api = require("../lib/api");
const { publicRuntimeConfig } = getConfig();

const isServer = typeof window === "undefined";
let cachedUserRepos, cachedUserStaredRepos;

function Index({ userRepos, userStartedRepos, user, router }) {
  useEffect(() => {
    if (!isServer) {
      cachedUserRepos = userRepos;
      cachedUserStaredRepos = userStartedRepos;
    }
  }, []);

  const tabKey = router.query.key || "1";
  const handleTabChange = (activeKey) => {
    Router.push(`/?key=${activeKey}`);
  };

  if (!user || !user.id) {
    return (
      <div className="root">
        <p>Please login</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
          Login
        </Button>

        <style jsx>{`
          .root {
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="root">
      <div className="user-info">
        <img src={user.avatar_url} alt="user avatar" className="avatar" />
        <span className="login">{user.login}</span>
        <span className="name">{user.name}</span>
        <span className="bio">{user.bio}</span>
        <p className="email">
          <Icon type="mail" style={{ marginRight: 10 }} />
          <a href={`mailto:${user.email}`}>{user.email}</a>
        </p>
      </div>
      <div className="user-repos">
        <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
          <Tabs.TabPane tab="My Repository" key="1">
            {userRepos.map((repo, index) => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="Following" key="2">
            {userStartedRepos.map((repo, index) => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>

      <style jsx>{`
        .root {
          display: flex;
          align-items: flex-start;
          padding: 20px 0;
        }
        .user-info {
          width: 200px;
          margin-right: 40px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
        }
        .login {
          font-weight: 800px;
          font-size: 20px;
          margin-top: 20px;
        }
        .name {
          font-size: 16px;
          color: #777;
        }
        .bio {
          margin-top: 20px;
          color: #333;
        }
        .avatar {
          width: 100%;
          border-radius: 5px;
        }
        .user-repos {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}

// when server rending
Index.getInitialProps = async ({ ctx, reduxStore }) => {
  const user = reduxStore.getState().user;
  if (!user || !user.id) {
    return {
      isLogin: false,
    };
  }

  if (!isServer) {
    if (cachedUserRepos && cachedUserStaredRepos) {
      return {
        userRepos: cachedUserRepos,
        userStartedRepos: cachedUserStaredRepos,
      };
    }
  }

  const userReposRes = await api.request(
    {
      method: "GET",
      url: "/user/repos",
    },
    ctx.req,
    ctx.res
  );

  const userStartedReposRes = await api.request(
    {
      method: "GET",
      url: "/user/starred",
    },
    ctx.req,
    ctx.res
  );

  return {
    userRepos: userReposRes.data,
    userStartedRepos: userStartedReposRes.data,
    isLogin: true,
  };
};

export default withRouter(
  connect(function mapState(state) {
    return {
      user: state.user,
    };
  })(Index)
);
