const NetworkManagerInterface = [
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_available",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_required",
          type: "uint256",
        },
      ],
      name: "InsufficientPayment",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_ruling",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_numberOfChoices",
          type: "uint256",
        },
      ],
      name: "InvalidRuling",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidStatus",
      type: "error",
    },
    {
      inputs: [],
      name: "NotArbitrator",
      type: "error",
    },
    {
      inputs: [],
      name: "NotPayer",
      type: "error",
    },
    {
      inputs: [],
      name: "PayeeDepositStillPending",
      type: "error",
    },
    {
      inputs: [],
      name: "ThirdPartyNotAllowed",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [],
      name: "ContractCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [],
      name: "ContractOwnershipUpdate",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract IArbitrator",
          name: "_arbitrator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "_disputeID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_metaEvidenceID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_evidenceGroupID",
          type: "uint256",
        },
      ],
      name: "Dispute",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract IArbitrator",
          name: "_arbitrator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "_evidenceGroupID",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "_party",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_evidence",
          type: "string",
        },
      ],
      name: "Evidence",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "index",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "string",
          name: "marketName",
          type: "string",
        },
      ],
      name: "MarketCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "_metaEvidenceID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "string",
          name: "_evidence",
          type: "string",
        },
      ],
      name: "MetaEvidence",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "oldOwner",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "contract IArbitrator",
          name: "_arbitrator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "_disputeID",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "_ruling",
          type: "uint256",
        },
      ],
      name: "Ruling",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
      ],
      name: "ServiceCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "purchaseId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "purchaser",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "referral",
          type: "address",
        },
      ],
      name: "ServicePurchased",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "registeredAddress",
          type: "address",
        },
        {
          indexed: true,
          internalType: "string",
          name: "lensHandle",
          type: "string",
        },
      ],
      name: "UserRegistered",
      type: "event",
    },
    {
      inputs: [],
      name: "LENS_CONTENT_REFERENCE_MODULE",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "LENS_FOLLOW_MODULE",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "_dai",
      outputs: [
        {
          internalType: "contract IERC20",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "_tokenFactory",
      outputs: [
        {
          internalType: "contract ITokenFactory",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      name: "addressToLensProfileId",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "arbitrationFeeDepositPeriod",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "arbitrator",
      outputs: [
        {
          internalType: "contract IArbitrator",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "marketId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "taskMetadataPtr",
          type: "string",
        },
      ],
      name: "createContract",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "marketId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "metadataPtr",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "initialMaxWaitlistSize",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "referralSharePayout",
          type: "uint256",
        },
        {
          components: [
            {
              internalType: "uint8",
              name: "v",
              type: "uint8",
            },
            {
              internalType: "bytes32",
              name: "r",
              type: "bytes32",
            },
            {
              internalType: "bytes32",
              name: "s",
              type: "bytes32",
            },
            {
              internalType: "uint256",
              name: "deadline",
              type: "uint256",
            },
          ],
          internalType: "struct DataTypes.EIP712Signature",
          name: "postSignature",
          type: "tuple",
        },
      ],
      name: "createService",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
      ],
      name: "depositArbitrationFeeForPayee",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "disputeIDtoRelationshipID",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
      ],
      name: "disputeRelationship",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
      ],
      name: "getContractData",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "employer",
              type: "address",
            },
            {
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              internalType: "string",
              name: "taskMetadataPtr",
              type: "string",
            },
            {
              internalType: "enum NetworkLibrary.ContractOwnership",
              name: "contractOwnership",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "acceptanceTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "resolutionTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "marketId",
              type: "uint256",
            },
          ],
          internalType: "struct NetworkLibrary.Relationship",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getContracts",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "employer",
              type: "address",
            },
            {
              internalType: "address",
              name: "worker",
              type: "address",
            },
            {
              internalType: "string",
              name: "taskMetadataPtr",
              type: "string",
            },
            {
              internalType: "enum NetworkLibrary.ContractOwnership",
              name: "contractOwnership",
              type: "uint8",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "acceptanceTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "resolutionTimestamp",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "marketId",
              type: "uint256",
            },
          ],
          internalType: "struct NetworkLibrary.Relationship[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "getLensProfileHandleFromAddress",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "getLensProfileIdFromAddress",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getOwner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getProtocolFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
      ],
      name: "getServiceData",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "marketId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "string",
              name: "metadataPtr",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "referralShare",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "exist",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxSize",
              type: "uint256",
            },
          ],
          internalType: "struct NetworkLibrary.Service",
          name: "",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getServices",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "marketId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "string",
              name: "metadataPtr",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "referralShare",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "exist",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "maxSize",
              type: "uint256",
            },
          ],
          internalType: "struct NetworkLibrary.Service[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
      ],
      name: "getWaitlistLength",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "governance",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "newWorker",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256",
        },
      ],
      name: "grantProposalRequest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "address",
          name: "tokenFactory",
          type: "address",
        },
        {
          internalType: "address",
          name: "_treasury",
          type: "address",
        },
        {
          internalType: "address",
          name: "_arbitrator",
          type: "address",
        },
        {
          internalType: "address",
          name: "_lensHub",
          type: "address",
        },
        {
          internalType: "address",
          name: "_governance",
          type: "address",
        },
        {
          internalType: "address",
          name: "dai",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "isRegisteredUser",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lensHub",
      outputs: [
        {
          internalType: "contract ILensHub",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "referral",
          type: "address",
        },
      ],
      name: "purchaseServiceOffering",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "purchasedServiceIdToMetdata",
      outputs: [
        {
          internalType: "uint256",
          name: "purchaseId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "client",
          type: "address",
        },
        {
          internalType: "bool",
          name: "exist",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "timestampPurchased",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "referral",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          components: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "string",
              name: "handle",
              type: "string",
            },
            {
              internalType: "string",
              name: "imageURI",
              type: "string",
            },
            {
              internalType: "address",
              name: "followModule",
              type: "address",
            },
            {
              internalType: "bytes",
              name: "followModuleInitData",
              type: "bytes",
            },
            {
              internalType: "string",
              name: "followNFTURI",
              type: "string",
            },
          ],
          internalType: "struct DataTypes.CreateProfileData",
          name: "vars",
          type: "tuple",
        },
      ],
      name: "registerWorker",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "relationshipIDToEscrowDetails",
      outputs: [
        {
          internalType: "enum NetworkLibrary.EscrowStatus",
          name: "status",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "disputeID",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "createdAt",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "reclaimedAt",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "payerFeeDeposit",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "payeeFeeDeposit",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "relationshipIDToMarketID",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "relationshipIDToRelationship",
      outputs: [
        {
          internalType: "address",
          name: "employer",
          type: "address",
        },
        {
          internalType: "address",
          name: "worker",
          type: "address",
        },
        {
          internalType: "string",
          name: "taskMetadataPtr",
          type: "string",
        },
        {
          internalType: "enum NetworkLibrary.ContractOwnership",
          name: "contractOwnership",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "acceptanceTimestamp",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "resolutionTimestamp",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "marketId",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "relationships",
      outputs: [
        {
          internalType: "address",
          name: "employer",
          type: "address",
        },
        {
          internalType: "address",
          name: "worker",
          type: "address",
        },
        {
          internalType: "string",
          name: "taskMetadataPtr",
          type: "string",
        },
        {
          internalType: "enum NetworkLibrary.ContractOwnership",
          name: "contractOwnership",
          type: "uint8",
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "acceptanceTimestamp",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "resolutionTimestamp",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "marketId",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
      ],
      name: "releaseContract",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
      ],
      name: "remainingTimeToDepositArbitrationFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "solutionMetadataPtr",
          type: "string",
        },
      ],
      name: "resolveContract",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "purchaseId",
          type: "uint256",
        },
      ],
      name: "resolveService",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "disputeId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "ruling",
          type: "uint256",
        },
      ],
      name: "rule",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "serviceIDToMarketID",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "serviceIdToMaxWaitlistSize",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "serviceIdToService",
      outputs: [
        {
          internalType: "uint256",
          name: "marketId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "string",
          name: "metadataPtr",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "referralShare",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "exist",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxSize",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      name: "services",
      outputs: [
        {
          internalType: "uint256",
          name: "marketId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
        {
          internalType: "string",
          name: "metadataPtr",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "wad",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "referralShare",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "exist",
          type: "bool",
        },
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "maxSize",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_LENS_CONTENT_REFERENCE_MODULE",
          type: "address",
        },
      ],
      name: "setLensContentReferenceModule",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_LENS_FOLLOW_MODULE",
          type: "address",
        },
      ],
      name: "setLensFollowModule",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "serviceId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "newMaxWaitlistSize",
          type: "uint256",
        },
      ],
      name: "setMaxWaitlistSize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "setOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "protocolFee",
          type: "uint256",
        },
      ],
      name: "setProtocolFee",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_evidence",
          type: "string",
        },
      ],
      name: "submitEvidence",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "treasury",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "contractId",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "newPointerHash",
          type: "string",
        },
      ],
      name: "updateTaskMetadataPointer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ]

export { NetworkManagerInterface }