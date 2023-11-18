import apiOptions from "./api-options";
const url = `http://${apiOptions.server}:${apiOptions.port}${apiOptions.silhar.url}`;

export const getDeliveryNotes = async (dateInit) => {
  const res = await fetch(url + apiOptions.silhar.getDeliveryNotes, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ dateInit }),
  });
  const data = await res.json();
  return data;
};

export const printDeliveryNote = async (jsonIn) => {
  const res = await fetch(url + apiOptions.silhar.deliveryNoteToZebra, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify(jsonIn),
  });
  const data = await res.json();
  return data;
};

export const deliveryNotesPrinted = async (arrIn, all, printerId, labelId) => {
  const res = await fetch(url + apiOptions.silhar.updateDeliveryNotesPrinted, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: arrIn, all, printerId, labelId }),
  });
  const data = await res.json();
  return data;
};

export const deliveryNotePrintAgain = async (jsonIn) => {
  const res = await fetch(url + apiOptions.silhar.deliveryNotePrintAgain, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify(jsonIn),
  });
  const data = await res.json();
  return data;
};

export const printReprocessLabel = async (arrIn) => {
  const res = await fetch(url + apiOptions.silhar.printReprocessLabel, {
    method: "post",
    headers: { "Content-type": "Application/json" },
    body: JSON.stringify({ data: arrIn }),
  });
  const data = await res.json();
  return data;
};
