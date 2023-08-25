import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

export const SignupForm = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: JSX.TargetedEvent<HTMLFormElement, Event>) {
    e.preventDefault();
    const formEl = e.target as HTMLFormElement;

    setLoading(true);
    const formData = new FormData(formEl);
    const response = await fetch("/api/corkboard/posts", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (response.status === 201) {
      formEl.reset();
    }
    if (data.message) {
      setResponseMessage(data.message);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={submit}>
      <label>
        What do you want to share?
        <textarea id="post" name="post" required />
      </label>
      <button disabled={loading}>{loading ? `Posting...` : `Post`}</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
}

export default SignupForm;