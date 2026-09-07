export const BSC = 56;
export const BSC_TESTNET = 97;

export const IDENTITY = {
  [BSC]: "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432",
  [BSC_TESTNET]: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
} as const;

export const COMMERCE = {
  [BSC]: "0xEa4DAa3100A767e86FDed867729ae7446476EBA6",
  [BSC_TESTNET]: "0xa206c0517B6371C6638CD9e4a42Cc9f02A33B0DE",
} as const;

export const EVALUATOR = {
  [BSC]: "0x51895229E12F9876011789B04f8698af06cCD6DA",
  [BSC_TESTNET]: "0xd7d36d66d2f1b608a0f943f722d27e3744f66f25",
} as const;

export const PAYMENT_TOKEN = {
  [BSC]: "0xcE24439F2D9C6a2289F741120FE202248B666666",
  [BSC_TESTNET]: "0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565",
} as const;

export const VENUS_COMPTROLLER = "0xfD36E2c2a6789Db23113685031d7F16329158384";

export const SCAN = {
  [BSC]: "https://bscscan.com",
  [BSC_TESTNET]: "https://testnet.bscscan.com",
} as const;

export const RPC = {
  [BSC]: "https://bsc-dataseed.binance.org",
  [BSC_TESTNET]: "https://bsc-testnet-dataseed.bnbchain.org",
} as const;

export const COMMERCE_ABI = [
  {
    type: "function",
    name: "createJob",
    stateMutability: "nonpayable",
    inputs: [
      { name: "provider", type: "address" },
      { name: "evaluator", type: "address" },
      { name: "expiredAt", type: "uint256" },
      { name: "description", type: "string" },
      { name: "hook", type: "address" },
    ],
    outputs: [{ name: "jobId", type: "uint256" }],
  },
  {
    type: "function",
    name: "setBudget",
    stateMutability: "nonpayable",
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "amount", type: "uint256" },
      { name: "optParams", type: "bytes" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "fund",
    stateMutability: "nonpayable",
    inputs: [
      { name: "jobId", type: "uint256" },
      { name: "expectedBudget", type: "uint256" },
      { name: "optParams", type: "bytes" },
    ],
    outputs: [],
  },
] as const;

export const ERC20_ABI = [
  {
    type: "function",
    name: "approve",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
] as const;

export const VENUS_ABI = [
  {
    type: "function",
    name: "getAccountLiquidity",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [
      { name: "error", type: "uint256" },
      { name: "liquidity", type: "uint256" },
      { name: "shortfall", type: "uint256" },
    ],
  },
] as const;
