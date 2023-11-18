export default function ErrForm({ errorForm, text }) {
  return (
    <label className={!errorForm ? "d-none" : "ms-1 mt-2 text-danger"}>
      {text}
    </label>
  );
}
