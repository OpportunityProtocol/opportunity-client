const ServiceCollectModuleInterface = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "hub",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "moduleGlobals",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "lensTalentNetworkManager",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "InitParamsInvalid",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ModuleDataMismatch",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotHub",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "HUB",
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
      "inputs": [],
      "name": "MODULE_GLOBALS",
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
          "name": "profileId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pubId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "package",
          "type": "uint8"
        }
      ],
      "name": "emergencyReleaseDisputedFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "profileId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pubId",
          "type": "uint256"
        }
      ],
      "name": "getPaymentProcessingData",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "currency",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "recipient",
              "type": "address"
            },
            {
              "internalType": "uint16",
              "name": "referralFee",
              "type": "uint16"
            },
            {
              "internalType": "uint256",
              "name": "serviceId",
              "type": "uint256"
            },
            {
              "internalType": "uint256[]",
              "name": "packages",
              "type": "uint256[]"
            }
          ],
          "internalType": "struct PaymentProcessingData",
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
          "name": "profileId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pubId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "initializePublicationCollectModule",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "referrerProfileId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "collector",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "profileId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pubId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "processCollect",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "profileId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "pubId",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "package",
          "type": "uint8"
        }
      ],
      "name": "releaseCollectedFunds",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  
export default ServiceCollectModuleInterface