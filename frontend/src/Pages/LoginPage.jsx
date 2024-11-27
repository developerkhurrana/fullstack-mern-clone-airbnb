import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import UserContext from "../UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext);

  async function loginHandler(ev) {
    ev.preventDefault();
    try {
      const { data } = await axios.post("/login", { email, password });
      setUser(data);
      alert(`Good to see you again, ${email}!`);
      setRedirect(true);
    } catch (error) {
      alert("Login failed.");
    }
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className=" mt-4 grow flex items-center justify-around">
      <div className=" mb-64">
        <h1 className=" text-4xl font-bold text-center mb-8">Welcome back!</h1>
        <form className=" max-w-md mx-auto" onSubmit={loginHandler}>
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

          <button className="primary">Login</button>
          <div className=" text-center py-2 font-semibold text-gray-500">
            Don&apos;t have an account yet?{" "}
            <Link
              to={"/register"}
              className=" underline text-black hover:text-rose-500"
            >
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
