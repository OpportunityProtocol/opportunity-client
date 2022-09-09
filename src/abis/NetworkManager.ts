const NetworkManagerInterface = [
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
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "metadataPtr",
        "type": "string"
      }
    ],
    "name": "ContractCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "enum NetworkLibrary.ContractOwnership",
        "name": "ownership",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "employer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "worker",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amt",
        "type": "uint256"
      }
    ],
    "name": "ContractOwnershipUpdate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "contract IArbitrator",
        "name": "_arbitrator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_disputeID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_metaEvidenceID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "_evidenceGroupID",
        "type": "uint256"
      }
    ],
    "name": "Dispute",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "contract IArbitrator",
        "name": "_arbitrator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_evidenceGroupID",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "_party",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_evidence",
        "type": "string"
      }
    ],
    "name": "Evidence",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "contractID",
        "type": "bytes32"
      }
    ],
    "name": "LogCancelArbitration",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "contractID",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "LogNotifyOfArbitrationRequest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "_metaEvidenceID",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "_evidence",
        "type": "string"
      }
    ],
    "name": "MetaEvidence",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "serviceId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "offers",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metadataPtr",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pubId",
        "type": "uint256"
      }
    ],
    "name": "ServiceCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "serviceId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "purchaseId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pubId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "purchaser",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "offer",
        "type": "uint256"
      }
    ],
    "name": "ServicePurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "serviceOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "serviceClient",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "purchaseId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "serviceId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint8",
        "name": "packageAmount",
        "type": "uint8"
      }
    ],
    "name": "ServiceResolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "lensProfileId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metadataPtr",
        "type": "string"
      }
    ],
    "name": "UpdateUserMetadata",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "registeredAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "string",
        "name": "lensHandle",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "profileId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "imageURI",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "metadata",
        "type": "string"
      }
    ],
    "name": "UserRegistered",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "_dai",
    "outputs": [
      {
        "internalType": "contract IERC20",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "_tokenFactory",
    "outputs": [
      {
        "internalType": "contract ITokenFactory",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "addressToLensProfileId",
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
    "name": "arbitrator",
    "outputs": [
      {
        "internalType": "contract IArbitrator",
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
        "internalType": "bytes32",
        "name": "contractID",
        "type": "bytes32"
      }
    ],
    "name": "cancelContractArbitration",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "taskMetadataPtr",
        "type": "string"
      }
    ],
    "name": "createContract",
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
        "name": "marketId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "metadataPtr",
        "type": "string"
      },
      {
        "internalType": "uint256[]",
        "name": "offers",
        "type": "uint256[]"
      },
      {
        "internalType": "address",
        "name": "lensTalentServiceCollectModule",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "lensTalentReferenceModule",
        "type": "address"
      }
    ],
    "name": "createService",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "disputeIDtoRelationshipID",
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
        "name": "contractID",
        "type": "uint256"
      }
    ],
    "name": "getContractData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "employer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "worker",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "taskMetadataPtr",
            "type": "string"
          },
          {
            "internalType": "enum NetworkLibrary.ContractOwnership",
            "name": "contractOwnership",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "wad",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "acceptanceTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "resolutionTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "marketId",
            "type": "uint256"
          }
        ],
        "internalType": "struct NetworkLibrary.Relationship",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getContracts",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "employer",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "worker",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "taskMetadataPtr",
            "type": "string"
          },
          {
            "internalType": "enum NetworkLibrary.ContractOwnership",
            "name": "contractOwnership",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "wad",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "acceptanceTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "resolutionTimestamp",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "marketId",
            "type": "uint256"
          }
        ],
        "internalType": "struct NetworkLibrary.Relationship[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "getLensProfileIdFromAddress",
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
    "name": "getProtocolFee",
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
        "name": "serviceId",
        "type": "uint256"
      }
    ],
    "name": "getServiceData",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "marketId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "metadataPtr",
            "type": "string"
          },
          {
            "internalType": "uint256[]",
            "name": "offers",
            "type": "uint256[]"
          },
          {
            "internalType": "bool",
            "name": "exist",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "collectModule",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "pubId",
            "type": "uint256"
          }
        ],
        "internalType": "struct NetworkLibrary.Service",
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
        "name": "purchaseId",
        "type": "uint256"
      }
    ],
    "name": "getServicePurchaseMetadata",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "purchaseId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "client",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "exist",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "timestampPurchased",
            "type": "uint256"
          },
          {
            "internalType": "uint8",
            "name": "offer",
            "type": "uint8"
          },
          {
            "internalType": "enum NetworkLibrary.ServiceResolutionStatus",
            "name": "status",
            "type": "uint8"
          }
        ],
        "internalType": "struct NetworkLibrary.PurchasedServiceMetadata",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getServices",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "marketId",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "creator",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "metadataPtr",
            "type": "string"
          },
          {
            "internalType": "uint256[]",
            "name": "offers",
            "type": "uint256[]"
          },
          {
            "internalType": "bool",
            "name": "exist",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "address",
            "name": "collectModule",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "referenceModule",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "pubId",
            "type": "uint256"
          }
        ],
        "internalType": "struct NetworkLibrary.Service[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVerifiedFreelancers",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "governance",
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
        "name": "contractID",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "newWorker",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "wad",
        "type": "uint256"
      }
    ],
    "name": "grantProposalRequest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "tokenFactory",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_treasury",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_arbitrator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_lensHub",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_proxyProfileCreator",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_governance",
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
        "name": "employer",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "serviceId",
        "type": "uint256"
      }
    ],
    "name": "isFamiliarWithService",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "isRegisteredUser",
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
    "inputs": [],
    "name": "lensHub",
    "outputs": [
      {
        "internalType": "contract ILensHub",
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
        "internalType": "bytes32",
        "name": "contractID",
        "type": "bytes32"
      },
      {
        "internalType": "address",
        "name": "requester",
        "type": "address"
      }
    ],
    "name": "notifyOfContractArbitrationRequest",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "proxyProfileCreator",
    "outputs": [
      {
        "internalType": "contract IProfileCreator",
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
        "name": "serviceId",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "offerIndex",
        "type": "uint8"
      }
    ],
    "name": "purchaseServiceOffering",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "purchasedServiceIdToMetdata",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "purchaseId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "client",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "exist",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "timestampPurchased",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "offer",
        "type": "uint8"
      },
      {
        "internalType": "enum NetworkLibrary.ServiceResolutionStatus",
        "name": "status",
        "type": "uint8"
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
            "internalType": "address",
            "name": "to",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "handle",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "imageURI",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "followModule",
            "type": "address"
          },
          {
            "internalType": "bytes",
            "name": "followModuleInitData",
            "type": "bytes"
          },
          {
            "internalType": "string",
            "name": "followNFTURI",
            "type": "string"
          }
        ],
        "internalType": "struct DataTypes.CreateProfileData",
        "name": "vars",
        "type": "tuple"
      },
      {
        "internalType": "string",
        "name": "metadata",
        "type": "string"
      }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "relationshipIDToMarketID",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "relationshipIDToRelationship",
    "outputs": [
      {
        "internalType": "address",
        "name": "employer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "worker",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "taskMetadataPtr",
        "type": "string"
      },
      {
        "internalType": "enum NetworkLibrary.ContractOwnership",
        "name": "contractOwnership",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "wad",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "acceptanceTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "resolutionTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "marketId",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "relationships",
    "outputs": [
      {
        "internalType": "address",
        "name": "employer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "worker",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "taskMetadataPtr",
        "type": "string"
      },
      {
        "internalType": "enum NetworkLibrary.ContractOwnership",
        "name": "contractOwnership",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "wad",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "acceptanceTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "resolutionTimestamp",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "marketId",
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
        "name": "contractID",
        "type": "uint256"
      }
    ],
    "name": "releaseContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractID",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "solutionMetadataPtr",
        "type": "string"
      }
    ],
    "name": "resolveContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "contractID",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "ruling",
        "type": "bytes32"
      }
    ],
    "name": "resolveDisputedContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "serviceId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "purchaseId",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "uint8",
            "name": "v",
            "type": "uint8"
          },
          {
            "internalType": "bytes32",
            "name": "r",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "s",
            "type": "bytes32"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          }
        ],
        "internalType": "struct DataTypes.EIP712Signature",
        "name": "sig",
        "type": "tuple"
      }
    ],
    "name": "resolveService",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "serviceIDToMarketID",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "serviceIdToPublicationId",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "serviceIdToPurchaseId",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "serviceIdToService",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "metadataPtr",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "exist",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "collectModule",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "referenceModule",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pubId",
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
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "services",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "metadataPtr",
        "type": "string"
      },
      {
        "internalType": "bool",
        "name": "exist",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "collectModule",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "referenceModule",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "pubId",
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
        "name": "protocolFee",
        "type": "uint256"
      }
    ],
    "name": "setProtocolFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "treasury",
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
        "internalType": "bytes32",
        "name": "contractID",
        "type": "bytes32"
      }
    ],
    "name": "triggerDisputeStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "metadataPtr",
        "type": "string"
      }
    ],
    "name": "updateMetadata",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "contractID",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "newPointerHash",
        "type": "string"
      }
    ],
    "name": "updateTaskMetadataPointer",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "verifiedFreelancers",
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
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "workRelationshipToStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]

export { NetworkManagerInterface }