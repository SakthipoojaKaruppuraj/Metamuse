// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/NFTProvenanceRegistry.sol";

contract DeployNFTProvenanceRegistry is Script {
    function run() external {
        vm.startBroadcast();

        NFTProvenanceRegistry registry = new NFTProvenanceRegistry();
        
        console.log("NFTProvenanceRegistry deployed at:", address(registry));

        vm.stopBroadcast();
    }
}
