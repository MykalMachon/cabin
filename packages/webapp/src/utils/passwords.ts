// stuff for validating user password
// is used on client and server side to validate password strength.
export type PasswordValidation = {
  regex: RegExp;
  label: string;
  error: string;
}

/**
 * default password validation rules
 */
export const passwordValidations = [{
  regex: /[A-Z]/,
  label: "Uppercase",
  error: "Password must contain at least one uppercase letter"
}, {
  regex: /[0-9]/,
  label: "Number",
  error: "Password must contain at least one number"
}, {
  regex: /[^a-zA-Z0-9]/,
  label: "Special Character",
  error: "Password must contain at least one special character"
}, {
  regex: /.{8,}/,
  label: "Length",
  error: "Password must be at least 8 characters long"
}];

/**
 * 
 * @param {string} password a password to test
 * @param {Array<PasswordValidation>} validations a set of validations to test the password against 
 * @returns {{isValid: boolean, errors: Array<string>}} an array of validations that failed, or an empty array is satisfied
 */
export const validatePassword = (password: string, validations: Array<PasswordValidation>): { isValid: boolean, errors: Array<string> } => {
  const newValErrors = validations.filter(validation => !validation.regex.test(password));
  return {
    isValid: newValErrors.length === 0,
    errors: newValErrors.map(validation => validation.error),
  };
};