// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    struct Wave {
        address waver; // The address of the user who waved.
        string message; // The message the user sent.
        uint256 timestamp; // The timestamp when the user waved.
    }

    uint256 totalWaves;
    Wave[] waves;
    uint256 prizeAmount = 0.01 ether;

    event NewWave(address indexed from, uint256 timestamp, string message);

    constructor() payable {}

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s has waved!", msg.sender);
        waves.push(Wave(msg.sender, _message, block.timestamp));

        // Send ETH to every user who waves me
        _sendMoney();
        emit NewWave(msg.sender, block.timestamp, _message);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function _sendMoney() private {
        address payable receiver = payable(msg.sender);
        require(
            prizeAmount <= address(this).balance,
            "Trying to withdraw more money than the contract has."
        );
        receiver.transfer(prizeAmount);
        // (bool success, ) = (msg.sender).call{value: prizeAmount}("");
        // require(success, "Failed to withdraw money from contract.");
    }
}
