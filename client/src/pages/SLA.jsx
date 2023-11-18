import { Col, Container, Form, Row } from "react-bootstrap";
import Title from "../components/Title";
import FormSearchSLA from "../components/carriers/SLA/FormSearchSLA";
import { useState } from "react";
import { tracking } from "../apis/carriers";
import Loader from "./Loader";
import ButtonSearch from "../components/carriers/SLA/ButtonSearch";
import TableResponse from "../components/carriers/SLA/TableResponse";
import Swal from "sweetalert2";

export default function SLA() {
  const [form, setForm] = useState({
    modfor: "",
    codfor: "",
    nrofor: "",
  });
  const [formStr, setFormStr] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const handleData = async () => {
    const arrForm = formStr.split("-"),
      jsonForm = { modfor: arrForm[0], codfor: arrForm[1], nrofor: arrForm[2] };
    setForm(jsonForm);
    setData([]);
    setFormStr("");
    await handleSubmit(undefined, jsonForm);
  };

  const handleSubmit = async (e, jsonIn) => {
    let jsonForm;
    if (e !== undefined) {
      e.preventDefault();
      if (form.modfor === "" || form.codfor === "" || form.nrofor === "") {
        return;
      }
      jsonForm = form;
    } else {
      if (
        jsonIn.modfor === "" ||
        jsonIn.codfor === "" ||
        jsonIn.nrofor === ""
      ) {
        return;
      }
      jsonForm = jsonIn;
    }
    console.log(jsonForm);

    setLoading(true);
    const { response, error, code } = await tracking([jsonForm]);
    setFormStr(`${jsonForm.modfor}-${jsonForm.codfor}-${jsonForm.nrofor}`);
    setForm({
      modfor: "",
      codfor: "",
      nrofor: "",
    });
    if (code > 299) {
      Swal.fire({
        title: error.message,
        icon: "error",
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 2500,
      });
      setLoading(false);
      return;
    }
    if (code === 207) {
      Swal.fire({
        title: "Hubo remitos no encontrados",
        icon: "warning",
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 2000,
      });
    }
    if (code === 201) {
      Swal.fire({
        title: "No se encontraron remitos",
        icon: "warning",
        showConfirmButton: false,
        showDenyButton: false,
        showCloseButton: false,
        timer: 2000,
      });
      setLoading(false);
      return;
    }
    setData(response.data);
    setLoading(false);
  };

  return (
    <>
      <Container fluid className="d-flex justify-content-center">
        <Col xs={12} sm={9} md={8} lg={7} xl={6} xxl={4} className="mt-4">
          <Title text="Consulta de estado de Remitos" />
        </Col>
      </Container>
      <Container>
        {loading ? (
          <Loader />
        ) : (
          <Form onSubmit={handleSubmit} className="d-inline w-100">
            <Row className="w-100">
              <FormSearchSLA form={form} setForm={setForm} setData={setData} />
            </Row>

            <Col
              xs={10}
              className={
                form.modfor === "" || form.codfor === "" || form.nrofor === ""
                  ? "d-none"
                  : "mt-2 pe-4"
              }
            >
              <ButtonSearch handleSubmit={handleSubmit} />
            </Col>
          </Form>
        )}
      </Container>
      <Container fluid className="mt-2 pt-2">
        {data.length > 0 ? (
          <TableResponse data={data} form={formStr} handleData={handleData} />
        ) : null}
      </Container>
    </>
  );
}
