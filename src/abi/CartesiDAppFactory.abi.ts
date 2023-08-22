export const ABI_JSON = [
    {
        "type": "event",
        "anonymous": false,
        "name": "ApplicationCreated",
        "inputs": [
            {
                "type": "address",
                "name": "consensus",
                "indexed": true
            },
            {
                "type": "address",
                "name": "dappOwner",
                "indexed": false
            },
            {
                "type": "bytes32",
                "name": "templateHash",
                "indexed": false
            },
            {
                "type": "address",
                "name": "application",
                "indexed": false
            }
        ]
    },
    {
        "type": "function",
        "name": "calculateApplicationAddress",
        "constant": true,
        "stateMutability": "view",
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_consensus"
            },
            {
                "type": "address",
                "name": "_dappOwner"
            },
            {
                "type": "bytes32",
                "name": "_templateHash"
            },
            {
                "type": "bytes32",
                "name": "_salt"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "newApplication",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_consensus"
            },
            {
                "type": "address",
                "name": "_dappOwner"
            },
            {
                "type": "bytes32",
                "name": "_templateHash"
            },
            {
                "type": "bytes32",
                "name": "_salt"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    },
    {
        "type": "function",
        "name": "newApplication",
        "constant": false,
        "payable": false,
        "inputs": [
            {
                "type": "address",
                "name": "_consensus"
            },
            {
                "type": "address",
                "name": "_dappOwner"
            },
            {
                "type": "bytes32",
                "name": "_templateHash"
            }
        ],
        "outputs": [
            {
                "type": "address",
                "name": ""
            }
        ]
    }
]
