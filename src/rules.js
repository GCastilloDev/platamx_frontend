const validationRules = () => ({
  email: [
    (v) => !!v || "Email es requerido",
    (v) =>
      /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(
        v
      ) || "Formato de correo incorrecto",
  ],
  password: [
    (v) =>
      /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(
        v
      ) || "Contraseña con formato incorrecto",
  ],
  confirmPassword: (password) => {
    return [
      (v) => v === password || "La contraseñas deben ser iguales",
      (v) => v.length === password.length || "La contraseñas deben ser iguales",
      (v) =>
        /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(
          v
        ) || "Contraseña con formato incorrecto",
    ];
  },
  required: [(v) => !!v || "Campo requerido"],
});

export default validationRules;
