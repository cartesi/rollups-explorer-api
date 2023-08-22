import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './CartesiDAppFactory.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    ApplicationCreated: new LogEvent<([consensus: string, dappOwner: string, templateHash: string, application: string] & {consensus: string, dappOwner: string, templateHash: string, application: string})>(
        abi, '0xe73165c2d277daf8713fd08b40845cb6bb7a20b2b543f3d35324a475660fcebd'
    ),
}

export const functions = {
    calculateApplicationAddress: new Func<[_consensus: string, _dappOwner: string, _templateHash: string, _salt: string], {_consensus: string, _dappOwner: string, _templateHash: string, _salt: string}, string>(
        abi, '0xbd4f1219'
    ),
    'newApplication(address,address,bytes32,bytes32)': new Func<[_consensus: string, _dappOwner: string, _templateHash: string, _salt: string], {_consensus: string, _dappOwner: string, _templateHash: string, _salt: string}, string>(
        abi, '0x0e1a07f5'
    ),
    'newApplication(address,address,bytes32)': new Func<[_consensus: string, _dappOwner: string, _templateHash: string], {_consensus: string, _dappOwner: string, _templateHash: string}, string>(
        abi, '0x3648bfb5'
    ),
}

export class Contract extends ContractBase {

    calculateApplicationAddress(_consensus: string, _dappOwner: string, _templateHash: string, _salt: string): Promise<string> {
        return this.eth_call(functions.calculateApplicationAddress, [_consensus, _dappOwner, _templateHash, _salt])
    }
}
