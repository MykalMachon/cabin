// form to actually reset your password

import { passwordValidations } from "@utils/passwords";
import PasswordInput from "./PasswordInput";

type PasswordResetFormProps = {
  token: string; // the token from the query string
  tokenState?: {
    isValid: boolean;
  }
};

const PasswordResetForm = ({ token, tokenState }: PasswordResetFormProps) => {

  // if password reset token is invalid, show that
  if (!token) {
    return (<p>password reset invalid</p>)
  }

  // todo: actual reset password form submit handler
  // todo: validate the token information

  return (
    <form action="/api/auth/passwords" method="POST">
      <input type="hidden" name="token" value={token} />
      <PasswordInput label="New password" validations={passwordValidations} />
      <button>Reset Password</button>
    </form>
  )
};

export default PasswordResetForm;