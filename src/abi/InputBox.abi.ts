export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "InputAdded",
        "inputs": [
            {
                "type": "address",
                "name": "dapp",
                "indexed": true
            },
            {
                "type": "uint256",
                "name": "inboxInputIndex",
                "indexed": true
            },
            {
                "type": "address",
                "name": "sender",
                "indexed": false
            },
            {
                "type": "bytes",
                "name": "input",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "addInput",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_dapp"
            },
            {
                "type": "bytes",
                "name": "_input"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getInputHash",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_dapp"
            },
            {
                "type": "uint256",
                "name": "_index"
            }
        ],
        "outputs": [
            {
                "type": "bytes32",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "getNumberOfInputs",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_dapp"
            }
        ],
        "outputs": [
            {
                "type": "uint256",
                "name": ""
            }
        ]
    }
]
