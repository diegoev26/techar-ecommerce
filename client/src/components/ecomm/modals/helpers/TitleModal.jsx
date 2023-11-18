export default function TitleModal({ clientName, actualStep }) {
  return (
    <span>
      {actualStep} - {clientName}
    </span>
  );
}
