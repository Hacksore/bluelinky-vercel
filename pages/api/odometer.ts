// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import BlueLinky from "bluelinky";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  //@ts-ignore
  const credentials = JSON.parse(process.env.BLUELINK_CREDENTIALS);

  const myPromise = new Promise((resolve, reject) => {
    const client = new BlueLinky(credentials);

    client.on("ready", async (v) => {
      const odometer = await v[0].odometer();
      
      //@ts-ignore
      resolve(odometer.value);
    });

    client.on("error", async (err) => {
      console.log("bluelink ~ error", err.message);
      reject(err.message);
    });
  });
  await myPromise
    .then((val) => res.status(200).json(val))
    .catch((err) => res.status(500).json(err));
};
