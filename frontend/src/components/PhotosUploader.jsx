import axios from "axios";
import { useContext, useState } from "react";
import {
  HiMiniStar,
  HiOutlineCloudArrowUp,
  HiOutlineStar,
  HiOutlineTrash,
} from "react-icons/hi2";
import UserContext from "../UserContext";

const PhotosUploader = ({ addedPhotos, onChange }) => {
  const [photoLink, setPhotoLink] = useState("");
  const { user } = useContext(UserContext);

  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post("/upload-by-link", {
      link: photoLink,
      username: user.name,
    });
    onChange((prev) => {
      return [...prev, filename];
    });
    setPhotoLink("");
  }

  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }
    data.append("username", user.name);

    axios
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        onChange((prev) => {
          return [...prev, ...filenames];
        });
      });
  }

  function removePhoto(ev, filename) {
    ev.preventDefault();
    onChange([...addedPhotos.filter((photo) => photo !== filename)]);
  }

  function setAsMain(ev, filename) {
    ev.preventDefault();
    onChange([filename, ...addedPhotos.filter((photo) => photo !== filename)]);
  }

  return (
    <>
      <h2 className="text-base mt-4 font-bold">Photos</h2>
      <div className="flex gap-4">
        <input
          type="text"
          name="imgInput"
          id="imgInput"
          placeholder="Add using link...jpg"
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
        />
        <button
          onClick={addPhotoByLink}
          className=" bg-gray-200 grow px-4 rounded-xl text-sm font-bold"
        >
          Add&nbsp;photo
        </button>
      </div>

      <div className="mt-2 grid gap-2 grid-cols-3 lg:grid-cols-6 md:grid-cols-4">
        {addedPhotos.length > 0 &&
          addedPhotos.map((link) => (
            <div className="h-32 flex relative" key={link}>
              <img
                src={`http://localhost:4000/uploads/${link}`}
                className="object-cover rounded-lg w-full h-32"
              />
              <button
                onClick={(ev) => removePhoto(ev, link)}
                className="text-white top-2 rounded right-2 absolute p-1 bg-black/30  cursor-pointer backdrop-blur-sm"
              >
                <HiOutlineTrash />
              </button>
              <button
                onClick={(ev) => setAsMain(ev, link)}
                className="text-white top-2 rounded left-2 absolute p-1 bg-black/30  cursor-pointer backdrop-blur-sm"
              >
                {link === addedPhotos[0] ? <HiMiniStar /> : <HiOutlineStar />}
              </button>
            </div>
          ))}

        <label className="border-[1px] bg-transparent rounded-2xl p-2 text-2xl cursor-pointer hover:text-white h-32 flex items-center gap-2 justify-center">
          <input
            multiple
            type="file"
            className="hidden"
            onChange={uploadPhoto}
          />
          <HiOutlineCloudArrowUp />
          Upload
        </label>
      </div>
    </>
  );
};

export default PhotosUploader;
