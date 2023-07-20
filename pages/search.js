import Link from "next/link";
import { Row, Col, List } from "antd";
import Router, { withRouter } from "next/router";

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

const selectedItemStyle = {
  borderLeft: "2px solid #e36209",
  fontWeight: 700,
};
function Search({ repos, router }) {
  const { sort, order, lang, query } = router.query;

  const handleLanguageChange = (language) => {
    Router.push({
      pathname: "/search",
      query: {
        query,
        lang: language,
        sort,
        order,
      },
    });
  };

  const handleSortChange = (sort) => {
    console.log(sort);
    Router.push({
      pathname: "/search",
      query: {
        query,
        lang,
        sort: sort.value,
        order: sort.order,
      },
    });
  };

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
              <List.Item style={item === lang ? selectedItemStyle : null}>
                <a
                  onClick={() => {
                    handleLanguageChange(item);
                  }}
                >
                  {item}
                </a>
              </List.Item>
            )}
          />
          <List
            bordered
            header={<span className="list-header">Sort</span>}
            style={{ marginBottom: 20 }}
            dataSource={SORT_TYPES}
            renderItem={(item) => {
              let selected = false;
              if (item.name === "Best Math" && !sort) {
                selected = true;
              } else if (item.value === sort && item.order === order) {
                selected = true;
              }
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  <a
                    onClick={() => {
                      handleSortChange(item);
                    }}
                  >
                    {item.name}
                  </a>
                </List.Item>
              );
            }}
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
