import { useEffect } from "react";
import axios from "axios";

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
      <div>Index</div>
    </>
  );
};
