import { Col, Container, Row } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getDeliveryNotesToTransmit } from "../apis/carriers";
import Swal from "sweetalert2";
import Loader from "./Loader";
import TransmittionTable from "../components/carriers/TransmittionTable";
import ButtonTransmit from "../components/carriers/ButtonTransmit";
import CarrierSelect from "../components/carriers/CarrierSelect";

export default function Carriers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [carrierSelected, setCarrierSelected] = useState(1);

  useEffect(() => {
    deliveryNotesToData(1);
  }, []);

  const deliveryNotesToData = async (carrier) => {
    setLoading(true);
    setData([]);
    setDisabled(true);
    const { response, error } = await getDeliveryNotesToTransmit(~~carrier);
    if (error !== undefined) {
      Swal.fire({
        title: "Error al obtener los remitos para transmitir",
        icon: "error",
        text: error.message,
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 2500,
      });
      setLoading(false);
      return;
    }
    if (response.code === 201) {
      Swal.fire({
        title: response.message,
        icon: "warning",
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 2500,
      });
    }
    setData(response.data);
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Container fluid className="pt-2 vh-50">
        <Row className="d-flex justify-content-baseline align-items-center">
          <Col>
            <CarrierSelect
              deliveryNotesToData={deliveryNotesToData}
              carrierSelected={carrierSelected}
              setCarrierSelected={setCarrierSelected}
            />
          </Col>
          <Col className="mb-2 ps-4 d-flex justify-content-center">
            <ButtonTransmit
              setLoading={setLoading}
              deliveryNotesToData={deliveryNotesToData}
              disabled={disabled}
              selection={selection}
              carrierSelected={carrierSelected}
            />
          </Col>
        </Row>
      </Container>
      <Container fluid className="mt-2">
        <TransmittionTable
          data={data}
          setDisabled={setDisabled}
          setSelection={setSelection}
        />
      </Container>
    </>
  );
}
