const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig"); // development only
const { axios } = require("axios");
const { Api, JsonRpc } = require("eosjs");
const fetch = require("node-fetch"); // node only; not needed in browsers
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

//getLastBlock();

// We can use it to get account info and to know if an account exists
async function getAccountInfo(accountName) {
  try {
    const accountInfo = await rpc.get_account(accountName);
    if (accountInfo) {
      console.log("----- Get Account Info -------");
      console.log("accountInfo", accountInfo);
      console.log("Account Exists:", accountInfo.account_name === accountName);
      return accountInfo;
    }
  } catch (error) {
    console.error(error);
    if (error.message.includes("unknown key")) {
      console.log("Account does not exist");
    }
  }
}

//getAccountInfo("fihow.c.wam");

const getNativeBalance = async (accountName, tokenSymbol = "WAX") => {
  try {
    const balance = await rpc.get_currency_balance(
      "eosio.token",
      accountName,
      tokenSymbol
    );
    console.log(`Balance of ${accountName} is: ${balance[0]}`);
  } catch (error) {
    console.error(`Error getting balance: ${error}`);
  }
};

//getNativeBalance("fihow.c.wam");

const getTokenBalance = async (accountName, tokenContract, tokenSymbol) => {
  try {
    const balance = await rpc.get_table_rows({
      json: true,
      code: tokenContract,
      scope: accountName,
      table: "accounts",
      lower_bound: tokenSymbol,
      upper_bound: tokenSymbol,
      key_type: "symbol",
      index_position: 1,
    });

    if (balance.rows.length > 0) {
      console.log(
        `Balance of Token ${tokenSymbol} of ${accountName} is: ${balance.rows[0].balance}`
      );
    } else {
      console.log(
        `User ${accountName} does not have any ${tokenSymbol} tokens.`
      );
    }
  } catch (error) {
    console.error(`Error getting balance: ${error}`);
  }
};

// getTokenBalance("iraces.nova", "novarallytok", "CHARM");
// getTokenBalance("sammysnake55", "novarallytok", "SNAKOIL");
// getTokenBalance("sammysnake55", "silversilver", "SILVER");

const getTransactionReceipt = async (txId) => {
  try {
    const tx = await rpc.history_get_transaction(txId);
    console.log("----- Get Transaction Receipt -------");
    console.log("tx", tx);
  } catch (error) {
    console.log("ERROR 2", JSON.stringify(error));
  }
};

// getTransactionReceipt(
//   "a4a37207879b2e3695a440cf030c7291ea209163b4d800bc89c0bb2efb9ac910"
// );

async function getNFTBalances(account) {
  // Example https://wax.api.atomicassets.io/atomicassets/v1/accounts/iraces.nova

  const url = `https://wax.api.atomicassets.io/atomicassets/v1/accounts/${account}`;
  try {
    const response = await fetch(url);
    console.log("----- Get NFT Balances -------");
    const nfts = await response.json();
    const userNfts = [];

    nfts.data.templates.forEach((nft) => {
      userNfts.push({
        img: "https://ipfs.io/ipfs/" + nft.template.immutable_data.img,
        name: nft.template.collection.collection_name,
        address: nft.template.contract,
        tokenType: "ERC721",
        chain: "WAX",
        tokenId: nft.template.template_id,
      });
    });
    console.log("userNfts", userNfts);
  } catch (error) {
    console.log("ERROR 3", JSON.stringify(error));
  }
}

// Endpoint to fetch All tokens "https://wax.light-api.net/api/balances/wax/sammysnake55"
const getAllTokensForAccount = async (account) => {
  const url = `https://wax.light-api.net/api/balances/wax/${account}`;
  try {
    const response = await fetch(url);
    console.log("----- Get All Tokens For Account -------");
    const tokens = await response.json();
    console.log("tokens", tokens);
  } catch (error) {
    console.log("ERROR 4", JSON.stringify(error));
  }
};

//getAllTokensForAccount("iraces.nova");
//getNFTBalances("sammysnake55");

async function sendToken() {
  const sendTx = await api.transact(
    {
      actions: [
        {
          account: "eosio.token",
          name: "transfer",
          authorization: [
            {
              actor: "tinchom11wax", // The Private key has to own this account
              permission: "active",
            },
          ],
          data: {
            from: "tinchom11wax",
            to: "fihow.c.wam",
            quantity: "2.00000000 WAX", // Needs to have exactly 8 decimals places and exact sybmol
            memo: "transfer native wax",
          },
        },
      ],
    },
    {
      blocksBehind: 3,
      expireSeconds: 30,
    }
  );

  console.log("----- Send Eosio Token WAX -------");
  console.log("sendTx", sendTx);
}

sendToken();

async function getLastBlock() {
  try {
    let info = await rpc.get_info();
    const lastBlockNumber = await rpc.get_block(
      info.last_irreversible_block_num
    );
    console.log("----- Get Last Block -------");
    console.log("lastBlockNumber", lastBlockNumber.block_num);
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}

const getRamBytes = async (accountName) => {
  const accountInfo = await getAccountInfo(accountName);
  console.log("accountInfo__", accountInfo);
  const ramQuota = accountInfo.ram_quota;
  const ramUsage = accountInfo.ram_usage;
  const ramBytes = ramQuota - ramUsage;
  console.log("----- Get Ram Quota -------");
  console.log("Available Ram Bytes", ramBytes);
  return ramBytes;
};

//getRamBytes("tinchom11wax");

const sellRamFunction = async () => {
  try {
    let availableRamQuota = await getRamBytes("tinchom11wax");
    const sellRam = await api.transact(
      {
        actions: [
          {
            account: "eosio",
            name: "sellram",
            authorization: [
              {
                actor: "tinchom11wax",
                permission: "active",
              },
            ],
            data: {
              account: "tinchom11wax",
              bytes: availableRamQuota,
            },
          },
        ],
      },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    );

    console.log("----- Sell Ram -------");
    console.log("sellRam", sellRam);
  } catch (error) {
    console.error(JSON.stringify(error));
  }
};

//sellRamFunction();

// Send TX Response Example
// sendTx {
//   transaction_id: 'd00381a4e25ef22dcb37c9aaa4fd227b651c7826678a3d9a5487c1f31fc92f23',
//   processed: {
//     id: 'd00381a4e25ef22dcb37c9aaa4fd227b651c7826678a3d9a5487c1f31fc92f23',
//     block_num: 282789338,
//     block_time: '2023-12-18T02:24:07.500',
//     producer_block_id: null,
//     receipt: { status: 'executed', cpu_usage_us: 167, net_usage_words: 17 },
//     elapsed: 167,
//     net_usage: 136,
//     scheduled: false,
//     action_traces: [ [Object] ],
//     account_ram_delta: null,
//     except: null,
//     error_code: null
//   }
// }

// Get Tx Receipt Example
// ----- Get Transaction Receipt -------
// tx {
//   id: 'a4a37207879b2e3695a440cf030c7291ea209163b4d800bc89c0bb2efb9ac910',
//   trx: {
//     receipt: {
//       status: 'executed',
//       cpu_usage_us: 0,
//       net_usage_words: 0,
//       trx: [Array]
//     },
//     trx: {
//       expiration: '',
//       ref_block_num: 0,
//       ref_block_prefix: 0,
//       max_net_usage_words: 0,
//       max_cpu_usage_ms: 0,
//       delay_sec: 0,
//       context_free_actions: [],
//       actions: [],
//       transaction_extensions: [],
//       signatures: [],
//       context_free_data: []
//     }
//   },
//   block_num: 282789813,
//   block_time: '2023-12-18T02:28:05.000',
//   last_irreversible_block: 282790138,
//   traces: [
//     {
//       receipt: [Object],
//       act: [Object],
//       account_ram_deltas: [Array],
//       context_free: false,
//       block_num: 282789813,
//       block_time: '2023-12-18T02:28:05.000',
//       console: '',
//       elapsed: 0,
//       except: null,
//       inline_traces: [],
//       producer_block_id: '',
//       trx_id: 'a4a37207879b2e3695a440cf030c7291ea209163b4d800bc89c0bb2efb9ac910'
//     },
//     {
//       receipt: [Object],
//       act: [Object],
//       account_ram_deltas: [Array],
//       context_free: false,
//       block_num: 282789813,
//       block_time: '2023-12-18T02:28:05.000',
//       console: '',
//       elapsed: 0,
//       except: null,
//       inline_traces: [],
//       producer_block_id: '',
//       trx_id: 'a4a37207879b2e3695a440cf030c7291ea209163b4d800bc89c0bb2efb9ac910'
//     },
//     {
//       receipt: [Object],
//       act: [Object],
//       account_ram_deltas: [Array],
//       context_free: false,
//       block_num: 282789813,
//       block_time: '2023-12-18T02:28:05.000',
//       console: '',
//       elapsed: 0,
//       except: null,
//       inline_traces: [],
//       producer_block_id: '',
//       trx_id: 'a4a37207879b2e3695a440cf030c7291ea209163b4d800bc89c0bb2efb9ac910'
//     }
//   ],
//   query_time_ms: 165.348
// }
