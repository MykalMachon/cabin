import { useState } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";

const BookingForm = () => {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: JSX.TargetedEvent<HTMLFormElement, Event>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/calendar/booking", {
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
      <label>
        Check-in Date
        <input type="date" name="checkin-date" id="checkin-date" required />
      </label>
      <label>
        Check-out Date
        <input type="date" name="checkout-date" id="checkout-date" required />
      </label>
      <label>
        Notes
        <textarea name="notes" id="notes" placeholder={`If you're booking for someone else, please put their contact info here.`}></textarea>
      </label>
      <button disabled={loading}>{loading ? `sending request...` : `Request Booking`}</button>
      {responseMessage && <p>{responseMessage}</p>}
    </form>
  );
}

export default BookingForm;