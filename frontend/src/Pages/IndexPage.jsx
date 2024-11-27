import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <div className="grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-8 p-4">
      {places.length > 0 &&
        places.map((place) => (
          <Link to={`/place/${place._id}`} className="" key={place._id}>
            <div className=" aspect-square bg-gray-300 mb-2 rounded-2xl overflow-hidden flex ">
              {place.photos?.[0] && (
                <img
                  src={`http://localhost:4000/uploads/${place.photos?.[0]}`}
                  alt=""
                  className="object-cover aspect-square"
                />
              )}
            </div>
            <h3
              className=" font-bold
        "
            >
              {place.address}
            </h3>
            <h2 className=" text-sm  text-gray-500">{place.title}</h2>
            <div className=" mt-1">
              <span className="font-bold text-base">${place.price}</span>{" "}
              <span className=" text-xs text-gray-400">/night</span>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default IndexPage;
