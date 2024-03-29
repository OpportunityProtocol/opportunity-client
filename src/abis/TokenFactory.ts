const TokenFactoryInterface = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "baseCost",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "priceRise",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "hatchTokens",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradingFeeRate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "platformFeeRate",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "allInterestToPlatform",
        "type": "bool"
      }
    ],
    "name": "NewMarket",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "platformFeeRate",
        "type": "uint256"
      }
    ],
    "name": "NewPlatformFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "addr",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "lister",
        "type": "address"
      }
    ],
    "name": "NewToken",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradingFeeRate",
        "type": "uint256"
      }
    ],
    "name": "NewTradingFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "oldOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipChanged",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "marketName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "baseCost",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "priceRise",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "hatchTokens",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tradingFeeRate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "platformFeeRate",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "allInterestToPlatform",
        "type": "bool"
      }
    ],
    "name": "addMarket",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "lister",
        "type": "address"
      }
    ],
    "name": "addToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      }
    ],
    "name": "getMarketDetailsByID",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "numTokens",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseCost",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "priceRise",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "hatchTokens",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tradingFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "platformFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "allInterestToPlatform",
            "type": "bool"
          }
        ],
        "internalType": "struct MarketDetails",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "marketName",
        "type": "string"
      }
    ],
    "name": "getMarketDetailsByName",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "numTokens",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseCost",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "priceRise",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "hatchTokens",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tradingFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "platformFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "allInterestToPlatform",
            "type": "bool"
          }
        ],
        "internalType": "struct MarketDetails",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "serviceToken",
        "type": "address"
      }
    ],
    "name": "getMarketDetailsByTokenAddress",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "numTokens",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "baseCost",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "priceRise",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "hatchTokens",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tradingFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "platformFeeRate",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "allInterestToPlatform",
            "type": "bool"
          }
        ],
        "internalType": "struct MarketDetails",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "marketName",
        "type": "string"
      }
    ],
    "name": "getMarketIDByName",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      }
    ],
    "name": "getMarketIDByTokenAddress",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumMarkets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenName",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      }
    ],
    "name": "getTokenIDByName",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      }
    ],
    "name": "getTokenIDPair",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "marketID",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tokenID",
            "type": "uint256"
          }
        ],
        "internalType": "struct IDPair",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tokenID",
        "type": "uint256"
      }
    ],
    "name": "getTokenInfo",
    "outputs": [
      {
        "components": [
          {
            "internalType": "bool",
            "name": "exists",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "contract IServiceToken",
            "name": "serviceToken",
            "type": "address"
          }
        ],
        "internalType": "struct TokenInfo",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenExchange",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenLogic",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "networkManager",
        "type": "address"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "setOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "platformFeeRate",
        "type": "uint256"
      }
    ],
    "name": "setPlatformFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "tradingFeeRate",
        "type": "uint256"
      }
    ],
    "name": "setTradingFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export default TokenFactoryInterface