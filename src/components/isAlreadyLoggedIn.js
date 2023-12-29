import axios from "axios";
import { URL } from "../config";

async function isAlreadyLoggedIn() {
  const values = localStorage.getItem("token");
  await axios
    .post(`${URL}post/isAuthenticated`, { token: values }, { retry: 3 })
    .then((res) => {
      if (res.data.code === "tokenValid") {
        return 1;
      } else {
        return 0;
      }
    });
}

export default isAlreadyLoggedIn;
