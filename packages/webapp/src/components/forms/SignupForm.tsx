import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import PasswordInput from "./inputs/PasswordInput";

const passwordValidations = [{
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

export const SignupForm = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: JSX.TargetedEvent<HTMLFormElement, Event>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: formData,
    });
    if (response.status === 200) {
      window.location.href = "/";
    }
    const data = await response.json();
    if (data.message) {
      setResponseMessage(data.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit}>
      <label>
        Name
        <input type="text" id="name" name="name" required />
      </label>
      <label>
        Email
        <input type="email" id="email" name="email" required />
      </label>
      <PasswordInput validations={passwordValidations} />
      <button disabled={loading}>{loading ? `loading...` : `Sign Up`}</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
}

export default SignupForm;