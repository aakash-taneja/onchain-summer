import { Button, Frog, parseEther } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";
import { abidegen } from "./abidegen.js";
import { abi } from "./abi.js";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  title: "nftads",
  assetsPath: "/",
  basePath: "/api",
  hub: {
    apiUrl: "https://hubs.airstack.xyz",
    fetchOptions: {
      headers: {
        "x-airstack-hubs": "144b4e7af6f3448f3891244d9b19f581b",
      },
    },
  },
});

app.frame("/:cid", (c) => {
  const { status } = c;
  const cid = c.req.param("cid");
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {status === "response" ? `Done` : `passed cid is : ${cid}`}
        </div>
        <img
          height={"150px"}
          width={"200px "}
          src={`https://gateway.lighthouse.storage/ipfs/${cid}`}
        />
      </div>
    ),
    intents: [
      <Button.Transaction target="/approve">Approve</Button.Transaction>,
      <Button.Transaction target="/mint">Collect</Button.Transaction>,
      <Button.Transaction target="/addNFT">Add NFT</Button.Transaction>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.transaction("/approve", (c) => {
  const address = c.address;
  // Contract transaction response.
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi: abidegen,
    chainId: "eip155:84532",
    functionName: "approve",
    args: ["0x701582a0b6ee50EB06a463bADB7545c5ac5adbBE", parseEther("1000")],
    to: "0x22A4FA38D3E0a3E791FDb0b9C48Fd42FBCFeE84b",
    // value: amountInWei,
  });

  return tx;
});
app.transaction("/addNFT", (c) => {
  const address = c.address;
  // Contract transaction response.
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "addNFT",
    args: [`${Date.now()}`, "100000000000000000", "1000"],
    to: "0x701582a0b6ee50EB06a463bADB7545c5ac5adbBE",
    // value: amountInWei,
  });

  return tx;
});
app.transaction("/mint", (c) => {
  const address = c.address;
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "mintNFT",
    args: [
      1,
      //nftId
      "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", // affiliate (address)
      1, // amount
    ],
    to: "0x701582a0b6ee50EB06a463bADB7545c5ac5adbBE",
    // value: amountInWei,
  });

  return tx;
});
// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
