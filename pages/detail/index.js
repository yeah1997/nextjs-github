import MarkdownRender from "../../components/MarkdownRender";
import withRepoBasic from "../../components/with-repo-basic";
import api from "../../lib/api";

function Detail({ readme }) {
  return <MarkdownRender content={readme.content} isBase64={true} />;
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
