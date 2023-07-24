import { Avatar, Button } from "antd";
import { useCallback, useState } from "react";
import dynamic from "next/dynamic";

import api from "../../lib/api";
import withRepoBasic from "../../components/with-repo-basic";
import { getLastUpdatedTime } from "../../util/time";

const MarkdownRender = dynamic(() => import("../../components/MarkdownRender"));

function IssueDetail({ issue }) {
  return (
    <div className="root">
      <MarkdownRender content={issue.body} />
      <div className="actions">
        <Button href={issue.html_url} target="_blank">
          open issue
        </Button>
      </div>
      <style jsx>{`
        .root {
          background: #fafafa;
          padding: 20px;
        }
        .actions {
          text-algin: center;
        }
      `}</style>
    </div>
  );
}

// %apfT6DeV@3m7Rj
function IssueItem({ issue }) {
  const [showDetail, setShowDetail] = useState(false);

  const toggleShowDetail = useCallback(() => {
    setShowDetail((detail) => !detail);
  }, []);

  return (
    <div>
      <div className="issue">
        <Button
          type="primary"
          size="small"
          style={{ position: "absolute", right: 10, top: 10 }}
          onClick={toggleShowDetail}
        >
          {showDetail ? "hide" : "view more"}
        </Button>
        <div className="avatar">
          <Avatar src={issue.user.avatar_url} shape="square" size={50} />
        </div>
        <div className="main-info">
          <h6>
            <span> {issue.title}</span>
          </h6>
          <p className="sub-info">
            <span>Updated at {getLastUpdatedTime(issue.updated_at)}</span>
          </p>
        </div>

        <style jsx>{`
          .issue {
            display: flex;
            position: relative;
            padding: 10px;
          }
          .issue:hover {
            background: #fafafa;
          }
          .issue + .issue {
            border-top: 1px solid #eee;
          }
          .main-info > h6 {
            max-width: 600px;
            padding-right: 40px;
            font-size: 16px;
          }
          .avatar {
            margin-right: 20px;
          }
          .sub-info {
            margin-bottom: 0;
          }
          .sub-info > span + span {
            display: inline-block;
            margin-left: 20px;
            font-size: 12px;
          }
        `}</style>
      </div>
      {showDetail && <IssueDetail issue={issue} />}
    </div>
  );
}

function Issues({ issues }) {
  return (
    <div className="root">
      <div className="issues">
        {issues.map((issue) => (
          <IssueItem issue={issue} key={issue.id} />
        ))}
      </div>
      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 20px;
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
}

Issues.getInitialProps = async (context) => {
  const { owner, name } = context.query;

  const issuesRes = await api.request(
    {
      url: `/repos/${owner}/${name}/issues`,
      method: "GET",
    },
    context.req,
    context.res
  );

  return {
    issues: issuesRes.data,
  };
};

export default withRepoBasic(Issues, "Issues");
