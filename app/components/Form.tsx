"use client";
import { FormEvent, useState } from "react";
import { handleServer } from "../server";
import { useRouter } from "next/navigation";
import * as EmailValidator from "email-validator";

const Form = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("HandleSubmit Triggered");
    if (!EmailValidator.validate(email)) {
      setError(true);
      setEmail("");
      return;
    }

    handleServer(email);
    setEmail("");
    setError(false);

    router.push("/work");
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter Email"
          className="h-8 w-64"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: "red" }}>Please Enter a Valid Email</p>}
    </>
  );
};
export default Form;
