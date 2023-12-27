import axios from "axios";
import { URL } from "../config";

async function isAlreadyLoggedIn() {
  // return true
  const values = localStorage.getItem("token");
  await axios
    .post(`${URL}post/isAuthenticated`, { token: values })
    .then((res) => {
      if (res.data.code === "tokenValid") {
        return 1;
      } else {
        return 0;
      }
    });
}

const output = isAlreadyLoggedIn();

export default isAlreadyLoggedIn;
