import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

export const LoginForm = () => {
  const [responseMessage, setResponseMessage] = useState("");

  async function submit(e: JSX.TargetedEvent<HTMLFormElement, Event>) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: formData,
    });
    if(response.status === 200) {
      window.location.href = "/";
    }
    const data = await response.json();
    console.log(data);
    if (data.message) {
      setResponseMessage(data.message);
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Email
        <input type="email" id="email" name="email" required />
      </label>
      <label>
        Password
        <input type="password" name="password" id="password" required />
      </label>
      <button>Login</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
}

export default LoginForm;