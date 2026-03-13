import axios from "axios";
import { DX_URL } from "../config/baseUrl";
import {
  GENERIC_ERROR_MESSAGE,
  SERVER_AUTH_ERROR_STATUS_CODE,
  SERVER_VALIDATION_STATUS_CODE,
} from "../config/constants";
import { getTokenForRole } from "../config/DataFile";

const API_URL = DX_URL;

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.interceptors.request.use(
  (config) => {
    // const token = LocalstorageService.getLoggedInUserToken();
    // const role = localStorage.getItem("DX_ROLE")

    // const token = getTokenForRole(role);

      // let token =  localStorage.getItem("DX_CO_TOKEN")

    const role = localStorage.getItem("DX_ROLE");
    let token = null;

    switch (role) {
      case "admin":
        token = localStorage.getItem("DX_AD_TOKEN");
        break;
      case "company":
        token = localStorage.getItem("DX_CO_TOKEN");
        break;
      case "customer":
        token = localStorage.getItem("DX_CU_TOKEN");
        break;
      case "dealer":
        token = localStorage.getItem("DX_DL_TOKEN");
        break;
      default:
        token = localStorage.getItem("DX_CO_TOKEN");
        break;
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      //   config.headers["ttxlanguage"] = i18next.resolvedLanguage;
      //   config.headers["ttxTimeZone"] =
      //     Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const { data, status } = error.response;
    if (status === SERVER_AUTH_ERROR_STATUS_CODE) {
      // LocalstorageService.logoutUser();
      // window.location.replace(ROUTE_URLS.LOGIN);
    }
    if (status === SERVER_VALIDATION_STATUS_CODE) {
      const { error } = data;
      const errorsArray = [];
      for (const key in error) {
        if (Object.hasOwnProperty.call(error, key)) {
          const _error = error[key];
          errorsArray.push(_error);
        }
      }
      return Promise.reject(errorsArray);
    }

    // Handle other error responses with specific messages
    if (data?.message) {
      return Promise.reject(data.message);
    }

    // Handle HTTP status codes with default messages
    const statusCodeMessages = {
      400: "Bad Request",
      401: "Unauthorized",
      403: "Forbidden",
      404: "Not Found",
      405: "Method Not Allowed",
      408: "Request Timeout",
      500: "Internal Server Error",
      502: "Bad Gateway",
      503: "Service Unavailable",
      504: "Gateway Timeout",
    };

    if (statusCodeMessages[status]) {
      return Promise.reject(statusCodeMessages[status]);
    }

    // Fallback to generic error message
    return Promise.reject(GENERIC_ERROR_MESSAGE);
  }
);

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config });
}

export async function post(url, data, config = {}) {
  // console.log(axiosApi);
  return axiosApi.post(url, { ...data }, { ...config });
}

export async function del(url, config = {}) {
  return await axiosApi.delete(url, { ...config });
}

export async function delPayload(url, data = {}, config = {}) {
  return await axiosApi.delete(url, {
    Authorization: { ...config },
    data: { ...data },
  });
}

export async function postFormData(url, data, config = {}) {
  return axiosApi.post(url, data, {
    "Content-Type": "multipart/form-data",
    ...config,
  });
}

export async function put(url, data, config = {}) {
  return axiosApi.put(url, { ...data }, { ...config });
}

export async function putFormData(url, data, config = {}) {
  return axiosApi.put(url, data, {
    "Content-Type": "multipart/form-data",
    ...config,
  });
}

export async function getPdf(url, responseType = "blob", config = {}) {
  return axiosApi.get(url, { ...config, responseType });
}

export async function postPdf(
  url,
  responseType = "application/pdf",
  config = {},
  data
) {
  return axiosApi.post(
    url,
    responseType,
    {
      ...config,
    },
    data
  );
}

export async function postExel(
  url,
  responseType = "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  config = {},
  data
) {
  return axiosApi.post(url, responseType, { ...config }, { ...data });
}
