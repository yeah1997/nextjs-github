const api = require("../lib/api");

function Index() {
  return (
    <>
      <div>Index</div>
    </>
  );
}

// when server rending
Index.getInitialProps = async ({ ctx }) => {
  const res = await api.request(
    {
      method: "GET",
      url: "/search/repositories?q=react",
    },
    ctx.req,
    ctx.res
  );

  return {
    data: res.data,
  };
};

export default Index;
