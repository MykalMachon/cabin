// form to request a password reset

import { useState } from "preact/hooks";

const PasswordForgotForm = () => {

  const [responseMessage, setResponseMessage] = useState("");
  const [hideForm, setHideForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: JSX.TargetedEvent<HTMLFormElement, Event>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/auth/password/forgot", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.status === 200) {
      setHideForm(true);
    }
    if (data.message) {
      setResponseMessage(data.message);
    }
    setLoading(false);
  }

  // TODO: actual password reset request handler
  // TODO: show a message that the password reset request was successful / failed

  return (
    <form onSubmit={submit} action="/api/auth/password/forgot" method="POST">
      {!hideForm && (<>
        <label>
          Email
          <input type="email" name="email" id="email" required />
        </label>
        <button>Request password reset</button>
      </>)}
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  )
};

export default PasswordForgotForm;