import { newOrder } from "../../apis/carriers";
import { Button } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ButtonTransmit({
  setLoading,
  deliveryNotesToData,
  disabled,
  selection,
  carrierSelected,
}) {
  const handleTransmittion = async () => {
    if (selection.length === 0 || disabled) {
      return;
    }
    setLoading(true);

    const arrOut = [];
    selection.forEach((rowId) => {
      arrOut.push({
        modfor: "ST",
        codfor: rowId.split("-")[0],
        nrofor: rowId.split("-")[1],
        idCarrier: ~~carrierSelected,
      });
    });

    const { error, code } = await newOrder(arrOut);
    if (code === 200) {
      Swal.fire({
        title: "Remitos transmitidos",
        icon: "success",
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 2500,
      });
    }
    if (code === 201 || code === 207) {
      Swal.fire({
        title: error.message,
        icon: "warning",
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 2500,
      });
    }
    if (code >= 400) {
      Swal.fire({
        title: "No se transmitieron los remitos",
        icon: "error",
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 2500,
      });
    }

    await deliveryNotesToData(carrierSelected);
    setLoading(false);
  };
  return (
    <Button
      variant="success"
      size="sm"
      disabled={disabled}
      className="shadow ms-4"
      type="submit"
      onClick={() => handleTransmittion()}
    >
      Transmitir Remitos
    </Button>
  );
}
