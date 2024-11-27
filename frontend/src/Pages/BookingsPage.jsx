import { useEffect, useState } from "react";
import AccountNav from "../components/AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import { Link } from "react-router-dom";
import { differenceInCalendarDays, format } from "date-fns";
import {
  HiCurrencyDollar,
  HiMoon,
  HiOutlineCalendarDays,
  HiOutlineCurrencyDollar,
  HiOutlineMoon,
} from "react-icons/hi2";
import Separator from "../components/Separator";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((res) => {
      setBookings(res.data);
    });
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="px-8">
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <Link
              key={booking.id}
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
              to={`/account/bookings/${booking._id}`}
            >
              <div className="w-48">
                <PlaceImg className="h-full" place={booking.place} />
              </div>
              <div className=" py-3 pr-3 grow">
                <h2 className=" text-xl">{booking.place.title}</h2>
                <div className="flex gap-2 items-center border-t border-gray-300 mt-2 pt-2">
                  <div className=" flex gap-1 items-center">
                    <HiOutlineCalendarDays className=" mb-[3px]" />
                    {format(new Date(booking.checkIn), "yyyy-MM-dd")}
                  </div>
                  &rarr;
                  <div className=" flex gap-1 items-center">
                    <HiOutlineCalendarDays className=" mb-[3px]" />
                    {format(new Date(booking.checkOut), "yyyy-MM-dd")}
                  </div>
                </div>
                <div className="flex flex-col justify-start text-base ">
                  <div
                    className="flex text-base gap-1 ju items-center
                  "
                  >
                    <HiOutlineMoon />
                    {differenceInCalendarDays(
                      new Date(booking.checkOut),
                      new Date(booking.checkIn)
                    )}{" "}
                    nights
                  </div>
                  <div className="flex text-base gap-1 items-center">
                    <HiOutlineCurrencyDollar /> Total Price <small>$</small>
                    {booking.price}
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default BookingsPage;
