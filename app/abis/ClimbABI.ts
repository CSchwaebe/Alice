export const ClimbABI = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "entropyAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "pointsAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "ReentrancyGuardReentrantCall",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "fromLevel",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "newLevel",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "gameEnded",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "randomNumber",
          "type": "uint256"
        }
      ],
      "name": "ClimbResult",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint64",
          "name": "sequenceNumber",
          "type": "uint64"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "randomNumber",
          "type": "uint256"
        }
      ],
      "name": "EntropyReceived",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "depositor",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "FundsDeposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "player",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "finalLevel",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            },
            {
              "internalType": "uint32",
              "name": "finalMultiplier",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "endReason",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "paidInPoints",
              "type": "bool"
            }
          ],
          "indexed": false,
          "internalType": "struct Climb.GameEndData",
          "name": "data",
          "type": "tuple"
        }
      ],
      "name": "GameEnded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "player",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
            }
          ],
          "indexed": false,
          "internalType": "struct Climb.GameStartData",
          "name": "data",
          "type": "tuple"
        }
      ],
      "name": "GameStarted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "oldMaxDeposit",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newMaxDeposit",
          "type": "uint256"
        }
      ],
      "name": "MaxDepositChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "level",
          "type": "uint8"
        },
        {
          "indexed": false,
          "internalType": "uint32",
          "name": "multiplierValue",
          "type": "uint32"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "payout",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "paidInPoints",
          "type": "bool"
        }
      ],
      "name": "PlayerCashedOut",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "oldContract",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newContract",
          "type": "address"
        }
      ],
      "name": "PointsContractUpdated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bool",
          "name": "oldValue",
          "type": "bool"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "newValue",
          "type": "bool"
        }
      ],
      "name": "PointsWithdrawableChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "player",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            },
            {
              "internalType": "uint8",
              "name": "level",
              "type": "uint8"
            },
            {
              "internalType": "uint64",
              "name": "sequenceNumber",
              "type": "uint64"
            }
          ],
          "indexed": false,
          "internalType": "struct Climb.RequestData",
          "name": "data",
          "type": "tuple"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "isCashout",
          "type": "bool"
        }
      ],
      "name": "RequestAttempted",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "MAX_LEVEL",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_CASHOUT_LEVEL",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_DEPOSIT",
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
      "name": "MULTIPLIER_PRECISION",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ODDS_PRECISION",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "sequence",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "provider",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "randomNumber",
          "type": "bytes32"
        }
      ],
      "name": "_entropyCallback",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "canPlayerCashOut",
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
          "name": "player",
          "type": "address"
        }
      ],
      "name": "canPlayerClimb",
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
      "name": "cashOut",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "climb",
      "outputs": [
        {
          "internalType": "uint64",
          "name": "",
          "type": "uint64"
        }
      ],
      "stateMutability": "payable",
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
      "name": "completedGames",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "finalLevel",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "success",
          "type": "bool"
        },
        {
          "internalType": "uint32",
          "name": "finalMultiplier",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "depositAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "payout",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "endReason",
          "type": "string"
        },
        {
          "internalType": "bool",
          "name": "paidInPoints",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "depositFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllLevelInfo",
      "outputs": [
        {
          "internalType": "uint16[11]",
          "name": "allOdds",
          "type": "uint16[11]"
        },
        {
          "internalType": "uint32[11]",
          "name": "allSonicMultipliers",
          "type": "uint32[11]"
        },
        {
          "internalType": "uint32[11]",
          "name": "allPointMultipliers",
          "type": "uint32[11]"
        },
        {
          "internalType": "uint8",
          "name": "minCashoutLevel",
          "type": "uint8"
        },
        {
          "internalType": "uint8",
          "name": "maxLevel",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllMultipliers",
      "outputs": [
        {
          "internalType": "uint32[11]",
          "name": "",
          "type": "uint32[11]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllOdds",
      "outputs": [
        {
          "internalType": "uint16[11]",
          "name": "",
          "type": "uint16[11]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllPointMultipliers",
      "outputs": [
        {
          "internalType": "uint32[11]",
          "name": "",
          "type": "uint32[11]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getClimbOdds",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameId",
          "type": "uint256"
        }
      ],
      "name": "getCompletedGame",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "player",
              "type": "address"
            },
            {
              "internalType": "uint8",
              "name": "finalLevel",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            },
            {
              "internalType": "uint32",
              "name": "finalMultiplier",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "endReason",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "paidInPoints",
              "type": "bool"
            }
          ],
          "internalType": "struct Climb.CompletedGame",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getContractBalance",
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
          "internalType": "uint8",
          "name": "level",
          "type": "uint8"
        }
      ],
      "name": "getLevelInfo",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "oddsToReach",
          "type": "uint16"
        },
        {
          "internalType": "uint32",
          "name": "sonicMultiplier",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "pointMultiplier_",
          "type": "uint32"
        },
        {
          "internalType": "bool",
          "name": "canCashOut",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "level",
          "type": "uint8"
        }
      ],
      "name": "getMultiplier",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "level",
          "type": "uint8"
        }
      ],
      "name": "getOdds",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getPlayerGame",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint8",
              "name": "currentLevel",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "internalType": "uint64",
              "name": "pendingSequence",
              "type": "uint64"
            },
            {
              "internalType": "enum Climb.RequestType",
              "name": "pendingType",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            }
          ],
          "internalType": "struct Climb.GameState",
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
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getPlayerGameCount",
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
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getPlayerGameHistory",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "offset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "limit",
          "type": "uint256"
        }
      ],
      "name": "getPlayerGameHistoryPaginated",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "gameId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "player",
              "type": "address"
            },
            {
              "internalType": "uint8",
              "name": "finalLevel",
              "type": "uint8"
            },
            {
              "internalType": "bool",
              "name": "success",
              "type": "bool"
            },
            {
              "internalType": "uint32",
              "name": "finalMultiplier",
              "type": "uint32"
            },
            {
              "internalType": "uint256",
              "name": "depositAmount",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "payout",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "endReason",
              "type": "string"
            },
            {
              "internalType": "bool",
              "name": "paidInPoints",
              "type": "bool"
            }
          ],
          "internalType": "struct Climb.CompletedGame[]",
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
          "name": "player",
          "type": "address"
        }
      ],
      "name": "getPlayerStats",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "totalGames",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalWins",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalBusts",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalDeposited",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "netProfit",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalAliceWon",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalSonicWon",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "highestLevelReached",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint8",
          "name": "level",
          "type": "uint8"
        }
      ],
      "name": "getPointMultiplier",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "player",
          "type": "address"
        },
        {
          "internalType": "uint8",
          "name": "level",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isPoints",
          "type": "bool"
        }
      ],
      "name": "getPotentialPayout",
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
          "internalType": "uint8",
          "name": "currentLevel",
          "type": "uint8"
        }
      ],
      "name": "getSuccessThreshold",
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
          "name": "randomNumber",
          "type": "uint256"
        },
        {
          "internalType": "uint8",
          "name": "currentLevel",
          "type": "uint8"
        }
      ],
      "name": "isClimbSuccessful",
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
          "internalType": "uint256",
          "name": "randomNumber",
          "type": "uint256"
        }
      ],
      "name": "isPointsPayout",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxDeposit",
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
      "name": "multiplier",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
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
      "name": "odds",
      "outputs": [
        {
          "internalType": "uint16",
          "name": "",
          "type": "uint16"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
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
      "name": "playerGameHistory",
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
          "name": "",
          "type": "address"
        }
      ],
      "name": "playerGames",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "currentLevel",
          "type": "uint8"
        },
        {
          "internalType": "bool",
          "name": "isActive",
          "type": "bool"
        },
        {
          "internalType": "uint64",
          "name": "pendingSequence",
          "type": "uint64"
        },
        {
          "internalType": "enum Climb.RequestType",
          "name": "pendingType",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "depositAmount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "gameId",
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
      "name": "pointMultiplier",
      "outputs": [
        {
          "internalType": "uint32",
          "name": "",
          "type": "uint32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pointsAreWithdrawable",
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
      "name": "pointsContract",
      "outputs": [
        {
          "internalType": "contract IPoints",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newMaxDeposit",
          "type": "uint256"
        }
      ],
      "name": "setMaxDeposit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newPointsContract",
          "type": "address"
        }
      ],
      "name": "setPointsContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "withdrawable",
          "type": "bool"
        }
      ],
      "name": "setPointsWithdrawable",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "startGame",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalGamesPlayed",
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
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "withdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]