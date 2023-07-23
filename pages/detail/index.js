import withRepoBasic from "../../components/with-repo-basic";

function Detail({ text }) {
  return <div>{text}</div>;
}

Detail.getInitialProps = async () => {
  return {
    text: 123,
  };
};

export default withRepoBasic(Detail, "Index");
