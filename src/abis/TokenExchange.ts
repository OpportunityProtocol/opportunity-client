const TokenExchange = [
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
        "internalType": "address",
        "name": "serviceToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "dai",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "daiInvested",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "tradingFeeInvested",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "platformFeeInvested",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "volume",
        "type": "uint256"
      }
    ],
    "name": "InvestedState",
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
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "NewPlatformOwner",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "serviceToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "NewTokenOwner",
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
        "name": "daiRedeemed",
        "type": "uint256"
      }
    ],
    "name": "PlatformFeeRedeemed",
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
        "name": "investmentToken",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "daiRedeemed",
        "type": "uint256"
      }
    ],
    "name": "PlatformInterestRedeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "serviceToken",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "investmentToken",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "daiRedeemed",
        "type": "uint256"
      }
    ],
    "name": "TokenInterestRedeemed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "daiRedeemed",
        "type": "uint256"
      }
    ],
    "name": "TradingFeeRedeemed",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "serviceToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "fallbackAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "cost",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "buyTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "serviceToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "getCostForBuyingTokens",
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
        "name": "marketDetails",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "feesDisabled",
        "type": "bool"
      }
    ],
    "name": "getCostsForBuyingTokens",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "raw",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tradingFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "platformFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct CostAndPriceAmounts",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "pure",
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
    "name": "getInterestPayable",
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
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      }
    ],
    "name": "getPlatformFeePayable",
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
        "internalType": "uint256",
        "name": "marketID",
        "type": "uint256"
      }
    ],
    "name": "getPlatformInterestPayable",
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
        "name": "serviceToken",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "getPriceForSellingTokens",
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
        "name": "marketDetails",
        "type": "tuple"
      },
      {
        "internalType": "uint256",
        "name": "supply",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "feesDisabled",
        "type": "bool"
      }
    ],
    "name": "getPricesForSellingTokens",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "total",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "raw",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "tradingFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "platformFee",
            "type": "uint256"
          }
        ],
        "internalType": "struct CostAndPriceAmounts",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTradingFeePayable",
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
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "authorizer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tradingFeeRecipient",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenFactory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "interestManager",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "dai",
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
        "name": "serviceToken",
        "type": "address"
      }
    ],
    "name": "isTokenFeeDisabled",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
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
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minPrice",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      }
    ],
    "name": "sellTokens",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "authorizer",
        "type": "address"
      }
    ],
    "name": "setAuthorizer",
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
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "setPlatformOwner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "factory",
        "type": "address"
      }
    ],
    "name": "setTokenFactoryAddress",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "serviceToken",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "set",
        "type": "bool"
      }
    ],
    "name": "setTokenFeeKillswitch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "setTokenOwner",
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
      }
    ],
    "name": "withdrawPlatformFee",
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
      }
    ],
    "name": "withdrawPlatformInterest",
    "outputs": [],
    "stateMutability": "nonpayable",
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
    "name": "withdrawTokenInterest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawTradingFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

export default TokenExchange