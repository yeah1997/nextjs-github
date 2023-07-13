import { withRouter } from "next/router";

function Search({ router }) {
  console.log(router.query);
  return <div>{router.query.query}</div>;
}

export default withRouter(Search);
