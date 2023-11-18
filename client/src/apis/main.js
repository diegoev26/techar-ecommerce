import apiOptions from "./api-options";
const url = `http://${apiOptions.server}:${apiOptions.port}`;

export const massiveMailing = async (jsonIn) => {
  const res = await fetch(url + apiOptions.main.massiveMailing, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify(jsonIn),
  });
  const data = await res.json();
  return data;
};
