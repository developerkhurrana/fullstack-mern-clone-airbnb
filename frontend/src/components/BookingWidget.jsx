import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import UserContext from "../UserContext";

const BookingWidget = ({ place }) => {
  const { user } = useContext(UserContext);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookerName, setBookerName] = useState("");
  const [bookerMobile, setBookerMobile] = useState(9876543210);
  const [redirect, setRedirect] = useState("");

  useEffect(() => {
    if (user) {
      setBookerName(user.name);
    }
  }, [user]);

  let nights = 0;
  if (checkIn && checkOut) {
    nights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

  async function bookthisPlace(ev) {
    ev.preventDefault();
    const response = await axios.post("/book-a-place", {
      checkIn,
      checkOut,
      guests,
      bookerName,
      bookerMobile,
      place: place._id,
      price: nights * place.price,
    });
    const bookingId = response.data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="">
      <div
        className="shadow p-4
       rounded-2xl mt-4 bg-white"
      >
        <div className="text-2xl text-center">
          Price: ${place.price} / night
        </div>
        <div className="border rounded-2xl mt-4 hover:border-rose-500 transition">
          <div className="flex">
            <div className="">
              <label
                className="border-[0px] hover:border-none
          "
              >
                Check in:
                <input
                  type="date"
                  value={checkIn}
                  onChange={(ev) => setCheckIn(ev.target.value)}
                />
              </label>
            </div>
            <div
              className="
      "
            >
              <label
                className="rounded-none border-[0px]
             "
              >
                Check out:
                <input
                  type="date"
                  value={checkOut}
                  onChange={(ev) => setCheckOut(ev.target.value)}
                />
              </label>
            </div>
          </div>
          <div
            className="p-4
      "
          >
            <label
              className="rounded-none border-[0px] pb-2 px-0  py-0

             "
            >
              Number of guests
            </label>
            <input
              type="number"
              value={guests}
              onChange={(ev) => setGuests(ev.target.value)}
            />
          </div>
          {nights > 0 && (
            <div
              className="  p-4

       "
            >
              <label
                className="rounded-none border-[0px] pb-2 px-0 py-0
              "
              >
                Your name
              </label>
              <input
                className=" mb-2"
                type="text"
                value={bookerName}
                onChange={(ev) => setBookerName(ev.target.value)}
              />
              <label
                className="rounded-none border-[0px] pb-2 px-0 py-0
              "
              >
                Phone number
              </label>
              <input
                className=""
                type="tel"
                value={bookerMobile}
                onChange={(ev) => setBookerMobile(ev.target.value)}
              />
            </div>
          )}
        </div>
        <button className="primary mt-4" onClick={bookthisPlace}>
          Book this place
          {nights > 0 && <span> for ${nights * place.price} </span>}
        </button>
      </div>
    </div>
  );
};

export default BookingWidget;
