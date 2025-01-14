import { Button, Frog } from "frog";
import { handle } from "frog/next";
import dotenv from "dotenv";
import axios from "axios";

// Uncomment this packages to tested on local server
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";

// Load environment variables from .env file
dotenv.config();

// Initialize Frog App
export const app = new Frog({
  assetsPath: "/",
  basePath: "/api/frame",
  title: "Chonks",
  imageAspectRatio: "1:1",
  headers: {
    "cache-control":
      "no-store, no-cache, must-revalidate, proxy-revalidate max-age=0, s-maxage=0",
  },
  imageOptions: {
    height: 600,
    width: 500,
  },
});

app.frame("/", (c) => {
  return c.res({
    image: "https://chonks-frame-generator.vercel.app/chonk.png",
    imageAspectRatio: "1.91:1",
    intents: [<Button action="/random">Display Chonks Nft</Button>],
  });
});
const Max_Supply = 83300;
const getRandomTokenId = () => {
  return Math.floor(Math.random() * Max_Supply) + 1;
};

const ALCHEMY_BASE_URL = `https://base-mainnet.g.alchemy.com/v2/XxWU7n2c8z5Wtte1dxeOkplsldBXm2vO`;

const fetchNFTMetadata = async (tokenId: number) => {
  const contractAddress = "0x07152bfde079b5319e5308c43fb1dbc9c76cb4f9";
  const url = `${ALCHEMY_BASE_URL}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}&refreshCache=false`;

  try {
    const response = await axios.get(url, {
      headers: {
        accept: "application/json",
      },
    });
    const cachedUrl = response.data.media[0].gateway;
    return cachedUrl;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw new Error("Failed to fetch NFT metadata");
  }
};

app.frame("/random", async (c) => {
  try {
    let rand = getRandomTokenId();
    const img = await fetchNFTMetadata(rand);

    return c.res({
      image: `${img}`,
      imageAspectRatio: "1.91:1",
      intents: [<Button action={`/random`}>Random Again</Button>],
    });
  } catch (error) {
    return c.error({
      message: "Error fetching Chonks NFT",
    });
  }
});

//uncomment below line while testing
devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
