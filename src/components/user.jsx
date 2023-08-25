import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const hostServer = import.meta.env.VITE_REACT_APP_SERVER_URL;

export default function User() {
  const navigate = useNavigate();

  const [session, setSession] = useState({});
  const { address, profileId, signature } = session;

  useEffect(() => {
    axios(`${hostServer}/authenticate`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        const { iat, ...authData } = data; // remove unimportant iat value

        setSession(authData);
      })
      .catch((err) => {
        navigate("/");
        console.log(err);
      });
  }, [navigate]);

  async function signOut() {
    await axios(`${hostServer}/logout`, {
      withCredentials: true,
    });

    navigate("/");
  }

  return (
    <div className="h-screen flex justify-center items-center w-full">
      <div className="flex flex-col space-y-4">
        <div className="space-y-6">
          <h1 className="font-bold">User session:</h1>
          <p>
            <span className="font-semibold">Address:</span>{" "}
            <span className=" text-red-500">{address}</span>
          </p>
          <h1>
            <span className="font-semibold">Profile Id:</span>
            <span className=" text-red-500">{profileId}</span>
          </h1>
          <p>
            <span className="font-semibold">Signature:</span>{" "}
            <span className=" text-red-500">{signature}</span>
          </p>
          <p>
            <span className="font-semibold">Email:</span>
            <span className="text-red-500">leopico.peceng@gmail.com</span>
          </p>
          <div>
            <input
              type="text"
              placeholder="subscribe your email"
              className="w-2/3 p-2 rounded border-2 h-12 rounded-r-none border-r-0 outline-none placeholder-gray-500"
            />
            <button
              className="w-1/3 bg-rose-500 p-3 h-12 rounded rounded-l-none
                          text-white hover:bg-rose-600"
            >
              update
            </button>
          </div>

          <button
            onClick={signOut}
            className="w-1/3 bg-rose-500 p-3 h-12 rounded
                          text-white hover:bg-rose-600 "
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
