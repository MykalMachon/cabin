// form to request a password reset

const PasswordForgotForm = () => {

  // TODO: actual password reset request handler
  // TODO: show a message that the password reset request was successful / failed

  return (
    <form action="/api/auth/password/reset" method="POST">
      <label>
        Email
        <input type="email" name="email" id="email" required />
      </label>
      <button>Request password reset</button>
    </form>
  )
};

export default PasswordForgotForm;