import withRepoBasic from "../../components/with-repo-basic";
import dynamic from "next/dynamic";
import api from "../../lib/api";
const MarkdownRender = dynamic(() => import("../../components/MarkdownRender"));

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
