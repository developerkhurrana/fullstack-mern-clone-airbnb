import { useContext, useState } from "react";
import UserContext from "../UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../components/AccountNav";

const AccountPage = () => {
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  const { subpage } = useParams();

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  if (!ready) {
    return "Loading...";
  }

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div>
      <AccountNav />
      {subpage === "profile" && (
        <div className=" text-center max-w-lg mx-auto border-[1px] p-2 rounded-2xl">
          Logged in as {user.name} ({user.email})
          <button className="primary mt-2" onClick={logout}>
            Logout
          </button>
        </div>
      )}
      {subpage === "places" && (
        <div className="">
          <PlacesPage />
        </div>
      )}
    </div>
  );
};

export default AccountPage;
