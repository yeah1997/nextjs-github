import Link from "next/link";
import { Row, Col, List, Pagination } from "antd";
import { withRouter } from "next/router";
import { memo, isValidElement } from "react";
import Repo from "../components/Repo";

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
const PER_PAGE = 20;

const selectedItemStyle = {
  borderLeft: "2px solid #e36209",
  fontWeight: 700,
};

const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
  let queryString = `?query=${query}`;
  if (lang) queryString += `&lang=${lang}`;
  if (sort) queryString += `&sort=${sort}&order=${order || "desc"}`;
  if (page) queryString += `&page=${page}`;
  queryString += `&per_page=${PER_PAGE}`;

  return (
    <Link href={`/search${queryString}`} style={{ pointEvents: "none" }}>
      {isValidElement(name) ? name : <a>{name}</a>}
    </Link>
  );
});

function noop() {}

function Search({ repos, router }) {
  const { lang, sort, order, query, page } = router.query;

  return (
    <div className="root">
      <Row gutter={24}>
        <Col span={6}>
          <List
            bordered
            header={<span className="list-header">Language</span>}
            style={{ marginBottom: 20 }}
            dataSource={LANGUAGE}
            renderItem={(item) => {
              const selected = item === lang;
              return (
                <List.Item style={selected ? selectedItemStyle : null}>
                  {selected ? (
                    <span>{item}</span>
                  ) : (
                    <FilterLink
                      query={query}
                      lang={item}
                      name={item}
                      order={order}
                      sort={sort}
                    />
                  )}
                </List.Item>
              );
            }}
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
                  {selected ? (
                    <span>{item.name}</span>
                  ) : (
                    <FilterLink
                      query={query}
                      lang={lang}
                      name={item.name}
                      order={item.order}
                      sort={item.value}
                    />
                  )}
                </List.Item>
              );
            }}
          />
        </Col>
        <Col span={18}>
          <h3 className="repos-title">{repos.total_count} repositories</h3>
          {repos.items.map((repo) => (
            <Repo repo={repo} key={repo.id} />
          ))}
          <div className="pagination">
            <Pagination
              pageSize={PER_PAGE}
              current={Number(page) || 1}
              total={repos.total_count > 1000 ? 1000 : repos.total_count}
              onChange={noop}
              itemRender={(page, type, ol) => {
                const pageMove =
                  type === "page"
                    ? page
                    : type === "prev"
                    ? page - 1
                    : page + 1;
                const name = type === "page" ? page : ol;
                return (
                  <FilterLink
                    lang={lang}
                    sort={sort}
                    order={order}
                    query={query}
                    page={pageMove}
                    name={name}
                  />
                );
              }}
            />
          </div>
        </Col>
      </Row>
      <style jsx>{`
        .root {
          padding: 20px 0;
        }
        .list-header {
          font-weight: 800;
          font-size: 16px;
        }
        .repos-title {
          border-bottom: 1px solid #eee;
          font-size: 24px;
          line-height: 50px;
        }
        .pagination {
          padding: 20px;
          text-algin: center;
        }
      `}</style>
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
  queryString += `&per_page=${PER_PAGE}`;

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
