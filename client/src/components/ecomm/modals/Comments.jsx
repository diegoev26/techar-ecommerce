import { Modal } from "react-bootstrap";

export default function Comments({
  showComments,
  comments,
  handleHideComments,
  clientName,
}) {
  return (
    <Modal
      show={showComments}
      size="xl"
      aria-labelledby="Comentarios"
      centered
      animation
      onHide={() => handleHideComments()}
    >
      <Modal.Header closeButton>
        <Modal.Title id="modal-comentarios" className="ms-4">
          Comentarios de cliente {clientName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table overflow table-sm table-hover table-condensed table-bordered table-striped w-100">
          <thead className="mw-100">
            <tr>
              <th className="w-25 px-5 pb-2">Fecha</th>
              <th className="w-25 px-5 pb-2">Usuario</th>
              <th className="w-50 px-5 pb-2">Comentarios</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment, key) => (
              <tr className="text-wrap mw-100" key={key}>
                <td className="text-center">{comment.FECINT}</td>
                <td className="text-center">{comment.USRINT}</td>
                <td>{comment.DESINT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
    </Modal>
  );
}
