import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet } from "wagmi/chains";

import User from "./components/user";
import SignIn from "./components/Signin";

const { publicClient, webSocketPublicClient } = configureChains(
  [mainnet],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignIn />,
  },
  {
    path: "/user",
    element: <User />,
  },
]);

function App() {
  return (
    <WagmiConfig config={config}>
      <RouterProvider router={router} />
    </WagmiConfig>
  );
}

export default App;
