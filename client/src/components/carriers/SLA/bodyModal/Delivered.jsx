import { Container } from "react-bootstrap";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

export default function Delivered({ date, setDate }) {
  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          inputFormat="DD/MM/YYYY"
          label="Elija la fecha de rendición"
          value={date}
          onChange={(e) => setDate(e)}
          maxDate={new Date()}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Container>
  );
}
