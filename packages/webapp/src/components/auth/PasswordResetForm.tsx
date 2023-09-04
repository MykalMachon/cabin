// form to actually reset your password
import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

import { passwordValidations } from "@utils/passwords";
import PasswordInput from "./PasswordInput";

type PasswordResetFormProps = {
  token: string; // the token from the query string
};

const PasswordResetForm = ({ token }: PasswordResetFormProps) => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: JSX.TargetedEvent<HTMLFormElement, Event>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/auth/password/reset", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.message) {
      setResponseMessage(data.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit}>
      <input type="hidden" name="token" value={token} />
      <PasswordInput label="New password" validations={passwordValidations} />
      <button disabled={loading}>{loading ? `Resetting...` : `Reset`}</button>
      {responseMessage && <p>{responseMessage}. <a href="/login">Return to login</a></p>}
    </form>
  )
};

export default PasswordResetForm;