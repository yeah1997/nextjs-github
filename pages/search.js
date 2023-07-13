import { withRouter } from "next/router";

function Search({ router }) {
  return <div>{router.query.query}</div>;
}

export default withRouter(Search);
