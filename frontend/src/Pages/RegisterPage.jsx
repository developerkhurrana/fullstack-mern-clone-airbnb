import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function registerUserHandler(ev) {
    ev.preventDefault();
    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });
      alert(`Welcome ${name}, Redirecting to Login`);
      setRedirect(true);
    } catch (error) {
      alert("Registration failed. Please try again.");
    }
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className=" mt-4 grow flex items-center justify-around">
      <div className=" mb-64">
        <h1 className=" text-4xl font-bold text-center mb-8">
          Great! Let&apos;s get you started
        </h1>
        <form className=" max-w-md mx-auto" onSubmit={registerUserHandler}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />

          <button className="primary">Register</button>

          <div className=" text-center py-2 font-semibold text-gray-500">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className=" underline text-black hover:text-rose-500"
            >
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
