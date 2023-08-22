import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './InputBox.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    InputAdded: new LogEvent<([dapp: string, inboxInputIndex: bigint, sender: string, input: string] & {dapp: string, inboxInputIndex: bigint, sender: string, input: string})>(
        abi, '0x6aaa400068bf4ca337265e2a1e1e841f66b8597fd5b452fdc52a44bed28a0784'
    ),
}

export const functions = {
    addInput: new Func<[_dapp: string, _input: string], {_dapp: string, _input: string}, string>(
        abi, '0x1789cd63'
    ),
    getInputHash: new Func<[_dapp: string, _index: bigint], {_dapp: string, _index: bigint}, string>(
        abi, '0x677087c9'
    ),
    getNumberOfInputs: new Func<[_dapp: string], {_dapp: string}, bigint>(
        abi, '0x61a93c87'
    ),
}

export class Contract extends ContractBase {

    getInputHash(_dapp: string, _index: bigint): Promise<string> {
        return this.eth_call(functions.getInputHash, [_dapp, _index])
    }

    getNumberOfInputs(_dapp: string): Promise<bigint> {
        return this.eth_call(functions.getNumberOfInputs, [_dapp])
    }
}
