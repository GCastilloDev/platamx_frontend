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
      ) ||
      "Contraseña con formato incorrecto, la contraseña debe ser de almenos 8 caracteres, incluyendo al menos un numero, mayuscula, minuscula y un caracter especial",
  ],
  confirmPassword: (password) => {
    return [
      (v) => v === password || "La contraseñas deben ser iguales",
      (v) => v.length === password.length || "La contraseñas deben ser iguales",
      (v) =>
        /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/.test(
          v
        ) ||
        "Contraseña con formato incorrecto, la contraseña debe ser de almenos 8 caracteres, incluyendo al menos un numero, mayuscula, minuscula y un caracter especial",
    ];
  },
  required: [(v) => !!v || "Campo requerido"],
  zipcode: [
    (v) => !!v || "Campo requerido",
    (v) => /^\d{5}$/.test(v) || "El código postal debe tener exactamente 5 números",
  ],
  phone: [
    (v) => !!v || "Campo requerido",
    (v) => /^\d{10}$/.test(v) || "El teléfono debe tener exactamente 10 números",
  ],
  maxLength200: [
    (v) => !!v || "Campo requerido",
    (v) => v.length <= 200 || "El texto excede los 200 caracteres permitidos",
  ],
});

export default validationRules;
