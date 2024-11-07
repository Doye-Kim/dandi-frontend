type UserInfomation = {
  email: string;
  password: string;
};

function validateEmail(values: { email: string }) {
  const errors = {
    email: '',
  };

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = '올바른 이메일 형식으로 입력해 주세요';
  }

  return errors;
}

function validatePastPassword(values: { pastPassword: string }) {
  const errors = {
    pastPassword: '',
  };

  if (!values.pastPassword) {
    errors.pastPassword = '비밀번호를 입력해 주세요';
  }

  return errors;
}

function validatePassword(values: { password: string }) {
  const errors = {
    password: '',
  };

  if (!values.password) {
    errors.password = '비밀번호를 입력해 주세요';
  }

  return errors;
}

function validatePasswordUpdate(values: {
  pastPassword: string;
  password: string;
  passwordConfirm: string;
}) {
  const errors = {
    pastPassword: '',
    password: '',
    passwordConfirm: '',
  };

  if (!values.password) {
    errors.password = '비밀번호를 입력해 주세요';
  } else if (!values.pastPassword) {
    errors.pastPassword = '비밀번호를 입력해 주세요';
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(values.password)
  ) {
    errors.password =
      '비밀번호는 영어 대소문자, 숫자 포함 8자 이상으로 설정해 주세요';
  } else if (values.pastPassword === values.password) {
    errors.password = '새 비밀번호는 현재 비밀번호와 달라야 합니다';
  }

  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = '비밀번호와 일치하지 않습니다.';
  }

  return errors;
}

function validatePasswordConfirm(values: {
  password: string;
  passwordConfirm: string;
}) {
  const errors = {
    password: '',
    passwordConfirm: '',
  };

  if (!values.password) {
    errors.password = '비밀번호를 입력해 주세요';
  } else if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(values.password)
  ) {
    errors.password =
      '비밀번호는 영어 대소문자, 숫자 포함 8자 이상으로 설정해 주세요';
  }

  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = '비밀번호와 일치하지 않습니다.';
  }

  return errors;
}

function validateLogin(values: UserInfomation) {
  return validateEmail(values) && validatePassword;
}

function validatePhone(values: { phone: string }) {
  const errors = {
    phone: '',
  };
  if (!/^010\d{7,8}$/.test(values.phone)) {
    errors.phone = '올바른 전화번호 형식으로 입력해 주세요';
  }
  return errors;
}

function validatePhoneAuthNum(values: { phoneAuthNum: string }) {
  const errors = {
    phoneAuthNum: '',
  };
  if (!values.phoneAuthNum) {
    errors.phoneAuthNum = ' ';
  }
  return errors;
}

function validateName(values: { name: string }) {
  const errors = {
    name: '',
  };
  if (!/^.{1,12}$/.test(values.name)) {
    errors.name = '닉네임은 12자 이하로 입력해 주세요';
  }

  return errors;
}
export {
  validateEmail,
  validateLogin,
  validatePassword,
  validatePastPassword,
  validatePasswordUpdate,
  validatePasswordConfirm,
  validatePhone,
  validatePhoneAuthNum,
  validateName,
};
