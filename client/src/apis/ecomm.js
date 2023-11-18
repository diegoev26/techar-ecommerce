import apiOptions from "./api-options";
const url = `http://${apiOptions.server}:${apiOptions.port}${apiOptions.ecommerce.url}`;

export const getData = async () => {
  const res = await fetch(url + apiOptions.ecommerce.getData, {
    method: "post",
    headers: { "Content-type": "Application/json" },
  });
  const data = await res.json();
  return data;
};

export const dataToChart = async () => {
  const res = await fetch(url + apiOptions.ecommerce.getDataToChart, {
    method: "post",
    headers: { "Content-type": "Application/json" },
  });
  const data = await res.json();
  return data;
};

export const getStatus = async () => {
  const res = await fetch(url + apiOptions.ecommerce.getStatus, {
    method: "post",
    headers: { "Content-type": "Application/json" },
  });
  const data = await res.json();
  return data;
};

export const taxConfirm = async ({ identi, taxCondition }) => {
  const res = await fetch(url + apiOptions.ecommerce.taxConfirm, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi, taxCondition } }),
  });
  const data = await res.json();
  return data;
};

export const getPercepts = async ({ identi }) => {
  const res = await fetch(url + apiOptions.ecommerce.getPercepts, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi } }),
  });
  const data = await res.json();
  return data;
};

export const setPercepts = async ({ identi }) => {
  const res = await fetch(url + apiOptions.ecommerce.setPercepts, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi } }),
  });
  const data = await res.json();
  return data;
};

export const payPercepts = async ({ identi, paymentCode, paymentComments }) => {
  const res = await fetch(url + apiOptions.ecommerce.payPercepts, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi, paymentCode, paymentComments } }),
  });
  const data = await res.json();
  return data;
};

export const getConfirmData = async ({ identi }) => {
  const res = await fetch(url + apiOptions.ecommerce.getConfirmData, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi } }),
  });
  const data = await res.json();
  return data;
};

export const saleConfirm = async ({ identi }) => {
  const res = await fetch(url + apiOptions.ecommerce.saleConfirm, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi } }),
  });
  const data = await res.json();
  return data;
};

export const getActualStep = async ({ identi }) => {
  const res = await fetch(url + apiOptions.ecommerce.actualStep, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi } }),
  });
  const data = await res.json();
  return data;
};

export const getContactData = async ({ identi }) => {
  const res = await fetch(url + apiOptions.ecommerce.getContactData, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi } }),
  });
  const data = await res.json();
  return data;
};

export const addContactData = async ({ identi, mail, phone }) => {
  const res = await fetch(url + apiOptions.ecommerce.addContactData, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi, mail, phone } }),
  });
  const data = await res.json();
  return data;
};

export const deleteContactData = async ({ identi, mail, phone }) => {
  const res = await fetch(url + apiOptions.ecommerce.deleteContactData, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi, mail, phone } }),
  });
  const data = await res.json();
  return data;
};

export const addComment = async ({ identi, comment }) => {
  const res = await fetch(url + apiOptions.ecommerce.addComment, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi, comment } }),
  });
  const data = await res.json();
  return data;
};

export const getComments = async ({ identi }) => {
  const res = await fetch(url + apiOptions.ecommerce.getComments, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi } }),
  });
  const data = await res.json();
  return data;
};

export const deleteSwitchOrder = async ({ identi, action }) => {
  const res = await fetch(url + apiOptions.ecommerce.deleteSwitchOrder, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: { identi, action } }),
  });
  const data = await res.json();
  return data;
};
