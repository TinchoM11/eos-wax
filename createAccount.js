const { Api, JsonRpc } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig");
const fetch = require("node-fetch");
const { TextEncoder, TextDecoder } = require("util");
require("dotenv").config();

const WAX_RPC = process.env.WAX_RPC;
const PK = process.env.ACCOUNT_PK;

const userPrivateKey = PK;
const signatureProvider = new JsSignatureProvider([userPrivateKey]);

const rpc = new JsonRpc(WAX_RPC, { fetch });

const api = new Api({
  rpc,
  signatureProvider,
  textDecoder: new TextDecoder(),
  textEncoder: new TextEncoder(),
});

//To create a new account submit three actions to the eosio account
async function createAccount() {
  await api.transact(
    {
      actions: [
        // The first action is the newaccount action.
        {
          account: "eosio",
          name: "newaccount",
          authorization: [
            {
              actor: "fihow.c.wam",
              permission: "active",
            },
          ],
          data: {
            creator: "fihow.c.wam",
            name: "tinchom11wax",
            owner: {
              threshold: 1,
              keys: [
                {
                  key: "EOS5zY4rP89TjNXj52yhfbiCFLrHJ4B3yGjodLFnqiVd3Gzyk65GF",
                  weight: 1,
                },
              ],
              accounts: [],
              waits: [],
            },
            active: {
              threshold: 1,
              keys: [
                {
                  key: "EOS6k5dnb1G5KkSURFGAfZj4aUBZC5yckVJE8f5HTJMy5WbcE1rH7",
                  weight: 1,
                },
              ],
              accounts: [],
              waits: [],
            },
          },
        },

        //The second action is the buyrambytes action.
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
            bytes: 8192,
          },
        },
        //The third action is the delegatebw action.
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
            stake_net_quantity: "0.01000000 WAX",
            stake_cpu_quantity: "0.01000000 WAX",
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

createAccount();
