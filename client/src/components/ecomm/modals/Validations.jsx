import Step01 from "./validations/Step01";
import Step02 from "./validations/Step02";
import Step03 from "./validations/Step03";
import Step04 from "./validations/Step04";
import Step05 from "./validations/Step05";
import Step06 from "./validations/Step06";
import Error from "./validations/Error";

export default function Validations({
  showStep01,
  showStep02,
  showStep03,
  showStep04,
  showStep05,
  showStep06,
  showError,
  handleHideValidation,
  clientId,
  clientName,
  actualStep,
  setChange,
  change,
  percepts,
  confirmData,
}) {
  return (
    <>
      <Step01
        showStep01={showStep01}
        handleHideValidation={handleHideValidation}
        clientId={clientId}
        clientName={clientName}
        actualStep={actualStep}
        setChange={setChange}
        change={change}
      />
      <Step02
        showStep02={showStep02}
        handleHideValidation={handleHideValidation}
        clientName={clientName}
        actualStep={actualStep}
      />
      <Step03
        showStep03={showStep03}
        handleHideValidation={handleHideValidation}
        clientName={clientName}
        actualStep={actualStep}
      />
      <Step04
        showStep04={showStep04}
        handleHideValidation={handleHideValidation}
        clientId={clientId}
        clientName={clientName}
        actualStep={actualStep}
        percepts={percepts}
        setChange={setChange}
        change={change}
      />
      <Step05
        showStep05={showStep05}
        handleHideValidation={handleHideValidation}
        clientId={clientId}
        clientName={clientName}
        actualStep={actualStep}
        setChange={setChange}
        change={change}
      />
      <Step06
        showStep06={showStep06}
        handleHideValidation={handleHideValidation}
        clientId={clientId}
        clientName={clientName}
        actualStep={actualStep}
        confirmData={confirmData}
        setChange={setChange}
        change={change}
      />
      <Error
        showError={showError}
        handleHideValidation={handleHideValidation}
        clientName={clientName}
        actualStep={actualStep}
      />
    </>
  );
}
