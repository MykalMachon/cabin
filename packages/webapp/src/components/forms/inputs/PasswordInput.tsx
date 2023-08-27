import { useEffect, useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";



type PasswordValidation = {
  regex: RegExp;
  label: string;
  error: string;
}

type PasswordInputProps = {
  name?: string;
  label?: string;
  placeholder?: string;
  validations: Array<PasswordValidation>;
}

type PasswordInputState = {
  valid: boolean;
  errors: Array<string>;
  touched: boolean;
}

const PasswordInput = ({ name = "password", label = "Password", placeholder = "", validations }: PasswordInputProps) => {

  const [validPasswordState, setValidPasswordState] = useState<PasswordInputState>({ valid: false, errors: [], touched: false })
  const [showPassword, setShowPassword] = useState(false);
  // combined regex of the validations that checks for all conditions at once
  const combinedRegex = new RegExp(validations.map((validation, idx) => `(?=${idx != 0 ? '.*' : ''}${validation.regex.source})`).join(''));

  const validatePassword = (password: string) => {
    const newValErrors = validations.filter(validation => !validation.regex.test(password));
    setValidPasswordState({
      valid: newValErrors.length === 0,
      errors: newValErrors.map(validation => validation.error),
      touched: password.length > 0
    })
  }

  const handleShowPassword = (e: JSX.TargetedEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  }

  const handlePasswordChange = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    const passwordEl = e.target as HTMLInputElement
    validatePassword(passwordEl.value);
  }

  return (
    <label>
      {label}
      <input
        className={validPasswordState.touched && !validPasswordState.valid ? 'error' : ''}
        type={showPassword ? 'text' : 'password'}
        name={name}
        id={name}
        placeholder={placeholder}
        onInput={handlePasswordChange}
        required
      />
      {validPasswordState.touched && !validPasswordState.valid ? (
        <>
          <button className="btn--link btn--link--small" onClick={handleShowPassword}>{showPassword ? 'hide' : 'show'} password</button>
          <ul className="password-validation">
            {validPasswordState.errors.map(error => <li>{error}</li>)}
          </ul>
        </>
      ) : null}
      {validPasswordState.touched && validPasswordState.valid ? (
        <small>password looks good 👍</small>
      ) : null}
    </label>
  )
};

export default PasswordInput;