export function validarIdenti(identi) {
  if (
    identi !== undefined &&
    identi.toString().length >= 10 &&
    identi.toString().length <= 16 &&
    identi.toString().trim() !== "" &&
    !isNaN(identi)
  ) {
    return { status: true, message: "Identi OK" };
  } else {
    return {
      status: false,
      message: "El Identi no cumple con los parámetros establecidos",
    };
  }
}
