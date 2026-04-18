const validationRules = (t) => ({
  email: [
    (v) => !!v || t('val_email_required'),
    (v) =>
      /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(
        v
      ) || t('val_email_format'),
  ],
  password: [
    (v) =>
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[$#@_-])(?!.* ).{8,16}$/.test(
        v
      ) || t('val_password_format'),
  ],
  confirmPassword: (password) => {
    return [
      (v) => v === password || t('val_password_match'),
      (v) => v.length === password.length || t('val_password_match'),
      (v) =>
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[$#@_-])(?!.* ).{8,16}$/.test(
          v
        ) || t('val_password_format'),
    ];
  },
  required: [(v) => !!v || t('val_required')],
  zipcode: [
    (v) => !!v || t('val_required'),
    (v) => /^\d{5}$/.test(v) || t('val_zipcode_format'),
  ],
  phone: [
    (v) => !!v || t('val_required'),
    (v) => /^\d{10}$/.test(v) || t('val_phone_format'),
  ],
  maxLength200: [
    (v) => !!v || t('val_required'),
    (v) => v.length <= 200 || t('val_max_200'),
  ],
});

export default validationRules;
