import { BsDoorClosed } from "react-icons/bs";
import { HiMiniWifi, HiOutlineTv } from "react-icons/hi2";
import { SiPetsathome } from "react-icons/si";
import { TbParkingCircle } from "react-icons/tb";

const Perks = ({ selected, onChange }) => {
  function checkBoxClickHandler(ev) {
    const { checked, name } = ev.target;
    let perkArray;
    if (checked) {
      perkArray = [...selected, name];
    } else {
      perkArray = selected.filter((selectedName) => selectedName !== name);
    }
    onChange(perkArray);
    console.log(perkArray);
  }
  return (
    <div className="mt-2 grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      <label>
        <input
          type="checkbox"
          checked={selected.includes("perks_wifi")}
          name="perks_wifi"
          onChange={checkBoxClickHandler}
        />
        <HiMiniWifi />
        <span>Wifi</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={selected.includes("perks_parking")}
          name="perks_parking"
          onChange={checkBoxClickHandler}
        />
        <TbParkingCircle />
        <span>Free parking spot</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={selected.includes("perks_tv")}
          name="perks_tv"
          onChange={checkBoxClickHandler}
        />
        <HiOutlineTv />
        <span>TV</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={selected.includes("perks_pets")}
          name="perks_pets"
          onChange={checkBoxClickHandler}
        />
        <SiPetsathome />
        <span>Pets</span>
      </label>
      <label>
        <input
          type="checkbox"
          checked={selected.includes("perks_pvtentrance")}
          name="perks_pvtentrance"
          onChange={checkBoxClickHandler}
        />
        <BsDoorClosed />
        <span>Private Entrance</span>
      </label>
    </div>
  );
};

export default Perks;
