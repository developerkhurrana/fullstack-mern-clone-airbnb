import {
  HiMiniListBullet,
  HiOutlineHomeModern,
  HiOutlineUser,
} from "react-icons/hi2";
import { Link, useLocation } from "react-router-dom";

const AccountNav = () => {
  const { pathname } = useLocation();
  let subpage = pathname.split("/")?.[2];
  console.log({ subpage });
  if (subpage === undefined) {
    subpage = "profile";
  }

  function linkClasses(type = null) {
    let baseClasses =
      "flex gap-2 py-2 px-6 bg-gray-200 rounded-full text-gray-600 font-semibold";
    if (type === subpage) {
      baseClasses =
        "flex gap-2 py-2 px-6 bg-rose-500 rounded-full text-white font-semibold";
    }
    return baseClasses;
  }
  return (
    <nav className="w-full flex mt-8 gap-2 justify-center mb-8">
      <Link to={"/account/profile"} className={linkClasses("profile")}>
        <HiOutlineUser className="mt-1" />
        My profile
      </Link>
      <Link to={"/account/bookings"} className={linkClasses("bookings")}>
        <HiMiniListBullet className="mt-1" />
        My bookings
      </Link>
      <Link to={"/account/places"} className={linkClasses("places")}>
        <HiOutlineHomeModern className="mt-1" />
        My accommodations
      </Link>
    </nav>
  );
};

export default AccountNav;
