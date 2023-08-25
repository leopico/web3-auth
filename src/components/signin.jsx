import { useNavigate } from "react-router-dom";

import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import axios from "axios";

const hostServer = import.meta.env.VITE_REACT_APP_SERVER_URL;
// console.log(hostServer);

export default function SignIn() {
  const navigate = useNavigate();

  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleAuth = async () => {
    //disconnects the web3 provider if it's already active
    if (isConnected) {
      await disconnectAsync();
    }
    // enabling the web3 provider metamask
    const { account } = await connectAsync({
      connector: new InjectedConnector(),
    });

    const userData = { address: account, chain: 1 };
    // making a post request to our 'request-message' endpoint
    const { data } = await axios.post(
      `${hostServer}/request-message`,
      userData,
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    const message = data.message;
    // signing the received message via metamask
    const signature = await signMessageAsync({ message });

    await axios.post(
      `${hostServer}/verify`,
      {
        message,
        signature,
      },
      { withCredentials: true } // set cookie from Express server
    );

    // redirect to /user
    navigate("/user");
  };

  return (
    <div className="h-screen flex justify-center items-center w-full">
      <div className="flex flex-col justify-center items-center w-full space-y-6">
        <h1 className="text-rose-500 text-2xl font-bold">Using Morails</h1>
        <h1 className="text-rose-500 text-2xl font-semibold">
          Web3 Auth and Your Own Database
        </h1>
        <button
          onClick={() => handleAuth()}
          className=" bg-rose-500 px-2 py-3 rounded-md
             text-white hover:bg-rose-600"
        >
          Authenticate via metamask
        </button>
      </div>
    </div>
  );
}
