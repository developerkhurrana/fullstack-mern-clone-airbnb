import Icon from "./logo/Icon";
import { HiMagnifyingGlass, HiMiniBars3, HiUser } from "react-icons/hi2";
import Separator from "./Separator";
import { Link } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../UserContext";

const Header = () => {
  const { user } = useContext(UserContext);
  return (
    <header className="p-4 flex items-center justify-between border-b-[1px]">
      <Link to={"/"} href="" className="">
        <Icon />
      </Link>
      <div className=" gap-2 flex items-center justify-center border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300">
        <div className="">Anywhere</div>
        <Separator />
        <div className="">Any week</div>
        <Separator />
        <div className="">Add guests</div>
        <button
          className=" bg-rose-500 p-2 rounded-full text-white font-bold hover:text-white
        "
        >
          <HiMagnifyingGlass size={16} />
        </button>
      </div>
      <Link
        to={user ? "/account" : "/login"}
        className="gap-2 flex items-center justify-center border border-gray-300 rounded-full p-2 pl-3"
      >
        <HiMiniBars3 />
        <div className=" bg-gray-500 rounded-full text-white  border-[2px] border-gray-500 overflow-hidden">
          <HiUser className=" relative top-[2px]" size={20} />
        </div>
        {!!user && <div className="">{user.name}</div>}
      </Link>
    </header>
  );
};

export default Header;
