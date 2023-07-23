import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";

function Detail({ readme }) {
  console.log(atob(readme.content));
  return <div>test</div>;
}

Detail.getInitialProps = async (ctx) => {
  const { owner, name } = ctx.query;

  const readmeRes = await api.request(
    {
      url: `/repos/${owner}/${name}/readme`,
      method: "GET",
    },
    ctx.req,
    ctx.res
  );

  return {
    readme: readmeRes.data,
  };
};

export default withRepoBasic(Detail, "Index");
