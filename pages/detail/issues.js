import withRepoBasic from "../../components/with-repo-basic";

function Issues({ text }) {
  return <div>{text}</div>;
}

Issues.getInitialProps = async () => {
  return {
    text: 456,
  };
};

export default withRepoBasic(Issues, "Issues");
