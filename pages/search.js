import Link from "next/link";
import { Row, Col, List } from "antd";
import { withRouter } from "next/router";

const api = require("../lib/api");

const LANGUAGE = ["Javascript", "HTML", "CSS", "TypeScript", "Java", "Rust"];
const SORT_TYPES = [
  {
    name: "Best Match",
  },
  {
    name: "Most Stars",
    value: "starts",
    order: "desc",
  },
  {
    name: "Fewest Stars",
    value: "starts",
    order: "asc",
  },
  {
    name: "Most Forks",
    value: "forks",
    order: "desc",
  },
  {
    name: "Fewest Forks",
    value: "forks",
    order: "asc",
  },
];

function Search({ repos, router }) {
  return (
    <div className="root">
      <Row gutter={20}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">Language</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGE}
            renderItem={(item) => (
              <List.Item>
                <Link href="/search">
                  <a>{item}</a>
                </Link>
              </List.Item>
            )}
          />
          <List
            bordered
            header={<span className="list-header">Order</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem={(item) => (
              <List.Item>
                <Link href="/search">
                  <a>{item.name}</a>
                </Link>
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </div>
  );
}

Search.getInitialProps = async ({ ctx }) => {
  const { query, sort, lang, order, page } = ctx.query;

  if (!query) {
    return {
      repos: {
        total_count: 0,
      },
    };
  }

  let queryString = `?q=${query}`;
  if (lang) queryString += `+language:${lang}`;
  if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`;
  if (page) queryString += `&page=${page}`;

  const result = await api.request(
    {
      url: `/search/repositories${queryString}`,
    },
    ctx.req,
    ctx.res
  );

  return {
    repos: result.data,
  };
};

export default withRouter(Search);
