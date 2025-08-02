// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CodingPod {
    address[] public members;
    mapping(address => uint256) public contributions;

    function joinPod() public {
        members.push(msg.sender);
    }

    function rewardContributor(address contributor, uint256 tokens) public {
        contributions[contributor] += tokens;
    }
} 