import { useEffect, useState } from "react";
import Perks from "../components/Perks";
import PhotosUploader from "../components/PhotosUploader";
import axios from "axios";
import AccountNav from "../components/AccountNav";
import { Navigate, useParams } from "react-router-dom";

const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100)
  const [rediect, setRediect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      const { data } = response;
      setTitle(data.title);
      setAddress(data.address);
      setAddedPhotos(data.photos);
      setDescription(data.description);
      setPerks(data.perks);
      setExtraInfo(data.extraInfo);
      setCheckIn(data.checkIn);
      setCheckOut(data.checkOut);
      setMaxGuests(data.maxGuests);
      setPrice(data.price)
    });
  }, [id]);

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    };
    if (id) {
      // Update Place
      await axios.put("/places", {
        id,
        ...placeData,
      });
      setRediect(true);
    } else {
      // New Place
      await axios.post("/places", placeData);
      setRediect(true);
    }
  }

  if (rediect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <>
      <AccountNav />
      <div className="mx-auto max-w-7xl border-[1px] pb-4 px-4 rounded-xl">
        <form onSubmit={savePlace}>
          <h2
            className="text-base mt-4 font-bold
          "
          >
            Title
          </h2>
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title for your place, should be short and catchy"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />
          <h2
            className="text-base mt-4 font-bold
          "
          >
            Address
          </h2>
          <input
            type="text"
            name="address"
            id="address"
            placeholder="Address to this place"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
          />
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          <h2
            className="text-base mt-4 font-bold
          "
          >
            Description
          </h2>
          <textarea
            name="description"
            placeholder="Description of the place..."
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
          <h2
            className="text-base mt-4 font-bold
          "
          >
            Photos
          </h2>
          <Perks selected={perks} onChange={setPerks} />
          <h2
            className="text-base mt-4 font-bold
          "
          >
            Extra info.
          </h2>
          <textarea
            name="extraInfo"
            placeholder="house rules, etc..."
            value={extraInfo}
            onChange={(ev) => setExtraInfo(ev.target.value)}
          />
          <h2
            className="text-base mt-4 font-bold
    "
          >
            Check in & out times, max guests
          </h2>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div className="">
              <h3 className="mt-2 text-base">Check-in time</h3>
              <input
                type="text"
                placeholder="14:00"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
              />
            </div>
            <div className="">
              <h3 className="mt-2 text-base">Check-out time</h3>
              <input
                type="text"
                placeholder="14:00"
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
              />
            </div>
            <div className="">
              <h3 className="mt-2 text-base">Max. number of guests</h3>
              <input
                type="number"
                placeholder="No. of guests"
                value={maxGuests}
                onChange={(ev) => setMaxGuests(ev.target.value)}
              />
            </div>
            <div className="">
              <h3 className="mt-2 text-base">Price per night</h3>
              <input
                type="number"
                placeholder="Price per night"
                value={price}
                onChange={(ev) => setPrice(ev.target.value)}
              />
            </div>
          </div>
          <button
            className="primary"
            disabled={!title || !address || !addedPhotos || !description}
          >
            Save
          </button>
        </form>
      </div>
    </>
  );
};

export default PlacesFormPage;
