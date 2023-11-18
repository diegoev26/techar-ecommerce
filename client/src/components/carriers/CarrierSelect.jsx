import { Form } from "react-bootstrap";
export default function CarrierSelect({
  carrierSelected,
  setCarrierSelected,
  deliveryNotesToData,
}) {
  const handleFormSelectChange = (e) => {
    setCarrierSelected(e.target.value);
    deliveryNotesToData(e.target.value);
  };

  return (
    <Form.Select
      size="sm"
      className="w-50 ms-4"
      onChange={(e) => handleFormSelectChange(e)}
      value={carrierSelected}
    >
      <option value={1}>Translog S.A.</option>
      <option value={2}>Login Transfarma</option>
    </Form.Select>
  );
}
