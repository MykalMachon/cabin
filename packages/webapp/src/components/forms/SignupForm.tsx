import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

export const SignupForm = () => {
  const [responseMessage, setResponseMessage] = useState("");

  async function submit(e: JSX.TargetedEvent<HTMLFormElement, Event>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);
    if (data.message) {
      setResponseMessage(data.message);
    }
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
      <label>
        Password
        <input type="password" name="password" id="password" required />
      </label>
      <button>Send</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
}

export default SignupForm;