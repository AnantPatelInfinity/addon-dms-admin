import { postFormData, get, putFormData, del, put } from "..";

const URI = "/company/user";

const getCompanyUserList = (payload) => {
  const URL = `${URI}/all-users-list`;
  return postFormData(URL, payload);
};

const getCompanyOneUser = (id) => {
  const URL = `${URI}/view/${id}`;
  return get(URL);
};

const createCompanyUser = (payload) => {
  const URL = `${URI}/register`;
  return postFormData(URL, payload);
};

const updateCompanyUser = (id, payload) => {
  const URL = `${URI}/update/${id}`;
  return putFormData(URL, payload);
};

const deleteCompanyUser = (id) => {
  const URL = `${URI}/delete/${id}`;
  return putFormData(URL);
};

export const CompanyUsersService = {
  getCompanyUserList,
  createCompanyUser,
  updateCompanyUser,
  deleteCompanyUser,
  getCompanyOneUser
};
