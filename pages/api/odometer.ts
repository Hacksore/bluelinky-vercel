// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import BlueLinky from "bluelinky";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  //@ts-ignore
  const credentials = JSON.parse(process.env.BLUELINK_CREDENTIALS);
  const { id } = req.query;
  //@ts-ignore
  const car = credentials[id];
  if (!id || !car) {
    return res.status(500).json("Wrong id param!");
  }
  const myPromise = new Promise((resolve, reject) => {
    const client = new BlueLinky(car.cred);

    client.on("ready", async () => {
      const vehicle = await client.getVehicle(car.vim);
      //@ts-ignore
      const odometer = await vehicle.odometer();
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
