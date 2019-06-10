import React, { Fragment, useState } from "react";
import VisuallyHidden from "@reach/visually-hidden";
import TabsButton from "./TabsButton";
import { FaDumbbell } from "react-icons/fa";
import { signup } from "./utils";

function TextInput({ id, label, type = "text" }) {
  return (
    <Fragment>
      <VisuallyHidden>
        <label htmlFor={id}>{label}</label>
      </VisuallyHidden>
      <input id={id} placeholder={label} type={type} required />
    </Fragment>
  );
}

export default function SignupForm() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async event => {
    event.preventDefault();
    setLoading(true);
    const [email, password] = event.target.elements;
    try {
      await signup({
        email: email.value,
        password: password.value
      });
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  return (
    <div>
      {error && (
        <div>
          <p>Oops, there was an error logging you in.</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      )}

      <form onSubmit={handleSignup}>
        <TextInput id="email" label="Email" />
        <TextInput id="password" label="Password" />
        <TabsButton>
          <FaDumbbell />
          <span>{loading ? "Loading..." : "Sign Up"}</span>
        </TabsButton>
      </form>
    </div>
  );
}
