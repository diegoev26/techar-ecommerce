import apiOptions from "./api-options";
const url = `http://${apiOptions.server}:${apiOptions.port}${apiOptions.carriers.url}`;

export const getDeliveryNotesToTransmit = async (idCarrier) => {
  const res = await fetch(
    url + apiOptions.carriers.getDeliveryNotesToTransmit,
    {
      method: "post",
      headers: { "Content-type": "Application/json" },
      body: JSON.stringify({ idCarrier }),
    }
  );
  const data = await res.json();
  return data;
};

export const newOrder = async (arrOut) => {
  const res = await fetch(url + apiOptions.carriers.newOrder, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: arrOut }),
  });
  const data = await res.json();
  return data;
};

export const tracking = async (arrOut) => {
  const res = await fetch(url + apiOptions.carriers.tracking, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: arrOut }),
  });
  const data = await res.json();
  return data;
};

export const updateDeliveryNotes = async (arrOut) => {
  const res = await fetch(url + apiOptions.carriers.updateDeliveryNotes, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: arrOut }),
  });
  const data = await res.json();
  return data;
};
