const { Api, JsonRpc } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const fetch = require("node-fetch");
const { TextEncoder, TextDecoder } = require("util");
require("dotenv").config();

const RPC = process.env.WAX_RPC;
const PK = process.env.ACCOUNT_PK;

const userPrivateKey = PK;
const signatureProvider = new JsSignatureProvider([userPrivateKey]);

const rpc = new JsonRpc(RPC, { fetch });
//const rpc = new JsonRpc("http://wax.eosrio.io", { fetch });

const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

// Buy RAM action
async function buyRam() {
  await api.transact(
    {
      actions: [
        // Buy RAM action
        {
          account: "eosio",
          name: "buyrambytes",
          authorization: [
            {
              actor: "fihow.c.wam",
              permission: "active",
            },
          ],
          data: {
            payer: "fihow.c.wam",
            receiver: "tinchom11wax",
            bytes: 4096,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
}

//buyRam();

async function stakeCpuAndNet() {
  await api.transact(
    {
      actions: [
        {
          account: "eosio",
          name: "delegatebw",
          authorization: [
            {
              actor: "fihow.c.wam",
              permission: "active",
            },
          ],
          data: {
            from: "fihow.c.wam",
            receiver: "tinchom11wax",
            stake_net_quantity: "0.10000000 WAX",
            stake_cpu_quantity: "3.10000000 WAX",
            transfer: false,
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );
}

stakeCpuAndNet();
