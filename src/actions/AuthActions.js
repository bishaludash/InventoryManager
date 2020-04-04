import {
  LOGIN_USER,
  //   LOGOUT_USER,
  GET_USER,
  LOGIN_ERROR
} from "../actions/types";
import axios from "axios";

export const loginUser = credentials => async dispatch => {
  try {
    const res = await axios.post(
      "http://127.0.0.1:8001/api/auth/login",
      credentials,
      {
        headers: { headersecret: "bharapasal!" }
      }
    );
    const data = res.data;

    if (data.status === "fail") {
      dispatch({
        type: LOGIN_ERROR,
        message: data.message,
        payload: null
      });
    } else {
      const user_token = data.apidata.access_token;
      localStorage.setItem("user_token", user_token);
      const user_details = await getCurrentUser();
      dispatch({
        type: LOGIN_USER,
        payload: data.apidata,
        currentUser: user_details,
        message: data.message,
        error: null
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: LOGIN_ERROR,
      payload: err.response.statusText,
      message: "Login Fail."
    });
  }
};

export const getUser = () => async dispatch => {
  const data = await getCurrentUser();
  const authStatus = data !== null ? true : false;
  dispatch({
    type: GET_USER,
    payload: data,
    authStatus: authStatus
  });
};

const getCurrentUser = async () => {
  try {
    const userState = JSON.parse(localStorage.getItem("userState"));
    const jwt_token = localStorage.getItem("user_token");

    // if user is authenticated return from localstore
    if (userState.isAuthenticated || userState.currentUser !== null) {
      const res = userState.currentUser;
      console.log(res);
      return res;
    }

    // if user is not authenticated, fetch data and return
    if (!userState.isAuthenticated || userState.currentUser === null) {
      console.log("Not logged in");

      if (jwt_token !== null) {
        const res = await axios.post(
          "http://127.0.0.1:8001/api/auth/me",
          {},
          {
            headers: {
              Authorization: "Bearer " + jwt_token
            }
          }
        );
        const data = res.data.apidata;
        console.log(res);
        return data;
      }
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

export const logoutUser = () => async dispatch => {
  const res = await axios.post(
    "http://127.0.0.1:8001/api/auth/logout",
    {},
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user_token")
      }
    }

    // clear localStore
    // clear state
  );
};
