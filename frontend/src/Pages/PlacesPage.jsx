import { HiMiniPlus } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";

const PlacesPage = () => {
  useState(false);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  return (
    <div className="">
      <AccountNav />
      <div className=" text-center">
        <Link
          to={"/account/places/new"}
          className="inline-flex gap-1 items-center bg-rose-500 text-white py-2 px-6 rounded-full antialiased"
        >
          <HiMiniPlus />
          Add new place
        </Link>
        <div className=" m-4 mx-auto flex flex-col gap-4 max-w-7xl">
          {places.length > 0 &&
            places.map((place) => (
              <Link
                to={`/account/places/${place._id}`}
                className="border cursor-pointer bg-gray-100 flex gap-4 p-4 rounded-2xl hover:border-rose-500 transition"
                key={place._id}
              >
                <div className="flex w-32 h-32 rounded-lg bg-gray-300 ">
                  {place.photos.length > 0 && (
                    <img
                      className="rounded-lg object-cover w-full"
                      src={`http://localhost:4000/uploads/${place.photos[0]}`}
                      alt=""
                    />
                  )}
                </div>
                <div className="">
                  {" "}
                  <h2 className=" text-xl font-semibold">{place.title}</h2>
                  <p className=" text-sm mt-2 text-start">
                    {place.description}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PlacesPage;
