const api = require("../lib/api");

function Index({}) {
  // console.log(userRepos, "userRepos");
  // console.log(userStartedRepos, "userStartedRepos");
  return (
    <>
      <div>Index</div>
    </>
  );
}

// when server rending
Index.getInitialProps = async ({ ctx }) => {
  // console.log(reduxStore, "reduxStore");
  // const user = reduxStore.user;
  // if (!user || !user.id) {
  //   return {
  //     isLogin: false,
  //   };
  // }
  // const userReposRes = await api.request(
  //   {
  //     method: "GET",
  //     url: "/user/repos",
  //   },
  //   ctx.req,
  //   ctx.res
  // );
  // const userStartedReposRes = await api.request(
  //   {
  //     method: "GET",
  //     url: "/user/starred",
  //   },
  //   ctx.req,
  //   ctx.res
  // );
  // return {
  //   userRepos: userReposRes.data,
  //   userStartedRepos: userStartedReposRes.data,
  //   isLogin: true,
  // };
};

export default Index;
