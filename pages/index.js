import getConfig from "next/config";
import { useEffect } from "react";
import axios from "axios";

const { publicRuntimeConfig } = getConfig();

export default () => {
  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("api/user/info");
      console.log(res, "res");
    }
    fetchData();
  }, []);

  return (
    <>
      <a href={publicRuntimeConfig.OAUTH_URL}>Login</a>
    </>
  );
};
