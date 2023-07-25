import { Avatar, Button, Select, Spin } from "antd";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import api from "../../lib/api";
import withRepoBasic from "../../components/with-repo-basic";
import { getLastUpdatedTime } from "../../util/time";
import SearchUser from "../../components/SearchUser";

const MarkdownRender = dynamic(() => import("../../components/MarkdownRender"));
const CACHE = [];
const isServer = typeof window === "undefined";

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
            <span>{issue.title}</span>
            {issue.labels.map((label) => (
              <Label label={label} key={label.id} />
            ))}
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

function makeIssuesQuery(creator, state, labels) {
  let creatorStr = creator ? `creator=${creator}` : "";
  let stateStr = state ? `state=${state}` : "";
  let labelsStr = "";

  if (labels && labels.length > 0) {
    labelsStr = `labels=${labels.join(",")}`;
  }

  const arr = [];

  if (creatorStr) arr.push(creatorStr);
  if (stateStr) arr.push(stateStr);
  if (labelsStr) arr.push(labelsStr);

  return `?${arr.join("&")}`;
}

function Label({ label }) {
  return (
    <>
      <span className="label" style={{ backgroundColor: `#${label.color}` }}>
        {label.name}
      </span>
      <style jsx>{`
        .label {
          display: inline-block;
          line-height: 20px;
          margin-left: 15px;
          padding: 3px;
          border-radius: 3px;
        }
      `}</style>
    </>
  );
}

const Option = Select.Option;
function Issues({ initialIssues, labels, owner, name }) {
  const [creator, setCreator] = useState();
  const [state, setState] = useState();
  const [label, setLabel] = useState();
  const [issues, setIssues] = useState(initialIssues);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (!isServer) CACHE[`${owner}/${name}`] = labels;
  }, [owner, name, labels]);

  const handleCreatorChange = useCallback((value) => {
    setCreator(value);
  }, []);

  const handleStateChange = useCallback((value) => {
    setState(value);
  });

  const handleLabelChange = useCallback((value) => {
    setLabel(value);
  });

  const handleSearch = useCallback(async () => {
    try {
      setFetching(true);
      const issuesSearchRes = await api.request({
        url: `/repos/${owner}/${name}/issues${makeIssuesQuery(
          creator,
          state,
          label
        )}`,
        method: "GET",
      });
      setIssues(issuesSearchRes.data);
      setFetching(false);
    } catch (err) {
      console.log(err, "err");
      setFetching(false);
    }
  }, [owner, name, creator, state, label]);

  return (
    <div className="root">
      <div className="search">
        <SearchUser onChange={handleCreatorChange} value={creator} />
        <Select
          placeholder="Status"
          value={state}
          onChange={handleStateChange}
          style={{ flexGrow: 1, marginLeft: 20 }}
        >
          <Option value="all">all</Option>
          <Option value="open">open</Option>
          <Option value="closed">closed</Option>
        </Select>
        <Select
          mode="multiple"
          placeholder="Label"
          style={{ flexGrow: 1, margin: "0 20px" }}
          value={label}
          onChange={handleLabelChange}
        >
          {labels.map((label) => (
            <Option value={label.name} key={label.id}>
              {label.name}
            </Option>
          ))}
        </Select>
        <Button type="primary" disabled={fetching} onClick={handleSearch}>
          Search
        </Button>
      </div>
      {fetching ? (
        <div className="loading">
          <Spin />
        </div>
      ) : (
        <div className="issues">
          {issues.map((issue) => (
            <IssueItem issue={issue} key={issue.id} />
          ))}
        </div>
      )}
      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          border-radius: 5px;
          margin-bottom: 20px;
          margin-top: 20px;
        }
        .search {
          display: flex;
        }
        .loading {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
}

Issues.getInitialProps = async (context) => {
  const { owner, name } = context.query;

  const fetch = await Promise.all([
    await api.request(
      {
        url: `/repos/${owner}/${name}/issues`,
        method: "GET",
      },
      context.req,
      context.res
    ),
    CACHE[`${owner}/${name}`]
      ? Promise.resolve({ data: CACHE[`${owner}/${name}`] })
      : await api.request(
          {
            url: `/repos/${owner}/${name}/labels`,
          },
          context.req,
          context.res
        ),
  ]);

  return {
    owner,
    name,
    initialIssues: fetch[0].data,
    labels: fetch[1].data,
  };
};

export default withRepoBasic(Issues, "Issues");
