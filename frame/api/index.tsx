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
  // hub: {
  //   apiUrl: "https://hubs.airstack.xyz",
  //   fetchOptions: {
  //     headers: {
  //       "x-airstack-hubs": "144b4e7af6f3448f3891244d9b19f581b",
  //     },
  //   },
  // },
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
    to: "0x2a12e7bcC4662227Ddd28b60627d9dc25598be1A",
    // value: amountInWei,
  });

  return tx;
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
    args: ["0x2a12e7bcC4662227Ddd28b60627d9dc25598be1A", parseEther("1000")],
    to: "0x76160579627CD45Ba88f23E5919C61444AF53D5A",
    // value: amountInWei,
  });

  return tx;
});

app.frame("/:cid", async (c) => {
  const cid = c.req.param("cid");
  const data = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
  const res = JSON.parse(await data.text());

  return c.res({
    action: `/second/${cid}`,
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
          {res.text}
        </div>
      </div>
    ),

    intents: [<Button>View Product</Button>],
  });
});

app.frame("/second/:cid", async (c) => {
  const cid = c.req.param("cid");
  const data = await fetch(`https://gateway.lighthouse.storage/ipfs/${cid}`);
  const res = JSON.parse(await data.text());
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
          {`Title: ${res.product.productTitle}`}
        </div>
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
          {`Price: ${res.product.productPrice}`}
        </div>
      </div>
    ),

    intents: [
      <Button.Link href="https://www.google.com">Buy now</Button.Link>,
      <Button.Transaction target="/approve">Approve</Button.Transaction>,
      <Button.Transaction target="/mint">Mint now</Button.Transaction>,
    ],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
