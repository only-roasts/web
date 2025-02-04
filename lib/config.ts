"server only";

import { PinataSDK } from "pinata-web3";
import { PinataFDK } from "pinata-fdk";

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.PINATA_GATEWAY_URL}`,
});
