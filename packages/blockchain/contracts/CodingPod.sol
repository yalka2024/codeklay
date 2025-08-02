// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title CodingPod
 * @dev Decentralized coding collaboration platform with tokenized rewards
 * @author CodePal Team
 */
contract CodingPod is ERC20, Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    // Structs
    struct Pod {
        uint256 id;
        string name;
        string description;
        address creator;
        address[] members;
        uint256 totalContributions;
        uint256 rewardPool;
        bool isActive;
        uint256 createdAt;
        mapping(address => uint256) memberContributions;
        mapping(address => bool) isMember;
    }

    struct Contribution {
        uint256 id;
        uint256 podId;
        address contributor;
        string contributionHash; // IPFS hash of contribution
        uint256 rewardAmount;
        uint256 timestamp;
        bool isVerified;
        string metadata; // JSON string with contribution details
    }

    struct Proposal {
        uint256 id;
        uint256 podId;
        address proposer;
        string title;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 endTime;
        bool executed;
        bool canceled;
        mapping(address => bool) hasVoted;
        mapping(address => bool) votedFor;
    }

    // State variables
    Counters.Counter private _podIds;
    Counters.Counter private _contributionIds;
    Counters.Counter private _proposalIds;

    mapping(uint256 => Pod) public pods;
    mapping(uint256 => Contribution) public contributions;
    mapping(uint256 => Proposal) public proposals;
    mapping(address => uint256[]) public userPods;
    mapping(address => uint256[]) public userContributions;

    // Events
    event PodCreated(uint256 indexed podId, string name, address indexed creator);
    event MemberJoined(uint256 indexed podId, address indexed member);
    event MemberLeft(uint256 indexed podId, address indexed member);
    event ContributionSubmitted(uint256 indexed contributionId, uint256 indexed podId, address indexed contributor);
    event ContributionVerified(uint256 indexed contributionId, uint256 rewardAmount);
    event RewardDistributed(uint256 indexed podId, address indexed member, uint256 amount);
    event ProposalCreated(uint256 indexed proposalId, uint256 indexed podId, address indexed proposer);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId);

    // Constants
    uint256 public constant MIN_CONTRIBUTION_REWARD = 10 * 10**18; // 10 tokens
    uint256 public constant MAX_CONTRIBUTION_REWARD = 1000 * 10**18; // 1000 tokens
    uint256 public constant PROPOSAL_DURATION = 7 days;
    uint256 public constant MIN_VOTING_POWER = 100 * 10**18; // 100 tokens

    constructor() ERC20("CodePal Token", "CPAL") {
        _mint(msg.sender, 1000000 * 10**18); // 1M tokens to deployer
    }

    /**
     * @dev Create a new coding pod
     * @param name Pod name
     * @param description Pod description
     */
    function createPod(string memory name, string memory description) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(balanceOf(msg.sender) >= MIN_VOTING_POWER, "Insufficient tokens to create pod");

        _podIds.increment();
        uint256 podId = _podIds.current();

        Pod storage pod = pods[podId];
        pod.id = podId;
        pod.name = name;
        pod.description = description;
        pod.creator = msg.sender;
        pod.isActive = true;
        pod.createdAt = block.timestamp;

        // Add creator as first member
        pod.members.push(msg.sender);
        pod.isMember[msg.sender] = true;
        userPods[msg.sender].push(podId);

        emit PodCreated(podId, name, msg.sender);
    }

    /**
     * @dev Join an existing pod
     * @param podId ID of the pod to join
     */
    function joinPod(uint256 podId) external {
        Pod storage pod = pods[podId];
        require(pod.isActive, "Pod is not active");
        require(!pod.isMember[msg.sender], "Already a member");
        require(balanceOf(msg.sender) >= MIN_VOTING_POWER, "Insufficient tokens to join pod");

        pod.members.push(msg.sender);
        pod.isMember[msg.sender] = true;
        userPods[msg.sender].push(podId);

        emit MemberJoined(podId, msg.sender);
    }

    /**
     * @dev Leave a pod
     * @param podId ID of the pod to leave
     */
    function leavePod(uint256 podId) external {
        Pod storage pod = pods[podId];
        require(pod.isMember[msg.sender], "Not a member of this pod");
        require(pod.creator != msg.sender, "Creator cannot leave pod");

        // Remove from members array
        for (uint256 i = 0; i < pod.members.length; i++) {
            if (pod.members[i] == msg.sender) {
                pod.members[i] = pod.members[pod.members.length - 1];
                pod.members.pop();
                break;
            }
        }

        pod.isMember[msg.sender] = false;
        pod.memberContributions[msg.sender] = 0;

        // Remove from user's pod list
        for (uint256 i = 0; i < userPods[msg.sender].length; i++) {
            if (userPods[msg.sender][i] == podId) {
                userPods[msg.sender][i] = userPods[msg.sender][userPods[msg.sender].length - 1];
                userPods[msg.sender].pop();
                break;
            }
        }

        emit MemberLeft(podId, msg.sender);
    }

    /**
     * @dev Submit a contribution to a pod
     * @param podId ID of the pod
     * @param contributionHash IPFS hash of the contribution
     * @param metadata JSON string with contribution details
     */
    function submitContribution(
        uint256 podId,
        string memory contributionHash,
        string memory metadata
    ) external {
        Pod storage pod = pods[podId];
        require(pod.isActive, "Pod is not active");
        require(pod.isMember[msg.sender], "Not a member of this pod");
        require(bytes(contributionHash).length > 0, "Contribution hash cannot be empty");

        _contributionIds.increment();
        uint256 contributionId = _contributionIds.current();

        Contribution storage contribution = contributions[contributionId];
        contribution.id = contributionId;
        contribution.podId = podId;
        contribution.contributor = msg.sender;
        contribution.contributionHash = contributionHash;
        contribution.metadata = metadata;
        contribution.timestamp = block.timestamp;
        contribution.isVerified = false;

        userContributions[msg.sender].push(contributionId);

        emit ContributionSubmitted(contributionId, podId, msg.sender);
    }

    /**
     * @dev Verify a contribution and distribute rewards
     * @param contributionId ID of the contribution to verify
     * @param rewardAmount Amount of tokens to reward
     */
    function verifyContribution(uint256 contributionId, uint256 rewardAmount) 
        external 
        onlyOwner 
        nonReentrant 
    {
        Contribution storage contribution = contributions[contributionId];
        require(contribution.id != 0, "Contribution does not exist");
        require(!contribution.isVerified, "Contribution already verified");
        require(
            rewardAmount >= MIN_CONTRIBUTION_REWARD && rewardAmount <= MAX_CONTRIBUTION_REWARD,
            "Reward amount out of range"
        );

        contribution.isVerified = true;
        contribution.rewardAmount = rewardAmount;

        // Update pod statistics
        Pod storage pod = pods[contribution.podId];
        pod.totalContributions++;
        pod.rewardPool += rewardAmount;
        pod.memberContributions[contribution.contributor] += rewardAmount;

        // Mint tokens to contributor
        _mint(contribution.contributor, rewardAmount);

        emit ContributionVerified(contributionId, rewardAmount);
        emit RewardDistributed(contribution.podId, contribution.contributor, rewardAmount);
    }

    /**
     * @dev Create a proposal for pod governance
     * @param podId ID of the pod
     * @param title Proposal title
     * @param description Proposal description
     */
    function createProposal(
        uint256 podId,
        string memory title,
        string memory description
    ) external {
        Pod storage pod = pods[podId];
        require(pod.isActive, "Pod is not active");
        require(pod.isMember[msg.sender], "Not a member of this pod");
        require(balanceOf(msg.sender) >= MIN_VOTING_POWER, "Insufficient voting power");

        _proposalIds.increment();
        uint256 proposalId = _proposalIds.current();

        Proposal storage proposal = proposals[proposalId];
        proposal.id = proposalId;
        proposal.podId = podId;
        proposal.proposer = msg.sender;
        proposal.title = title;
        proposal.description = description;
        proposal.endTime = block.timestamp + PROPOSAL_DURATION;

        emit ProposalCreated(proposalId, podId, msg.sender);
    }

    /**
     * @dev Vote on a proposal
     * @param proposalId ID of the proposal
     * @param support True for yes, false for no
     */
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp < proposal.endTime, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed && !proposal.canceled, "Proposal already executed or canceled");

        Pod storage pod = pods[proposal.podId];
        require(pod.isMember[msg.sender], "Not a member of this pod");

        uint256 votingPower = balanceOf(msg.sender);
        require(votingPower >= MIN_VOTING_POWER, "Insufficient voting power");

        proposal.hasVoted[msg.sender] = true;
        proposal.votedFor[msg.sender] = support;

        if (support) {
            proposal.forVotes += votingPower;
        } else {
            proposal.againstVotes += votingPower;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    /**
     * @dev Execute a proposal if it has enough votes
     * @param proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 proposalId) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Proposal does not exist");
        require(block.timestamp >= proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.canceled, "Proposal was canceled");
        require(proposal.forVotes > proposal.againstVotes, "Proposal did not pass");

        proposal.executed = true;

        // TODO: Implement proposal execution logic based on proposal type
        // This could include changing pod settings, adding/removing members, etc.

        emit ProposalExecuted(proposalId);
    }

    /**
     * @dev Get pod information
     * @param podId ID of the pod
     */
    function getPod(uint256 podId) external view returns (
        uint256 id,
        string memory name,
        string memory description,
        address creator,
        uint256 totalContributions,
        uint256 rewardPool,
        bool isActive,
        uint256 createdAt
    ) {
        Pod storage pod = pods[podId];
        return (
            pod.id,
            pod.name,
            pod.description,
            pod.creator,
            pod.totalContributions,
            pod.rewardPool,
            pod.isActive,
            pod.createdAt
        );
    }

    /**
     * @dev Get pod members
     * @param podId ID of the pod
     */
    function getPodMembers(uint256 podId) external view returns (address[] memory) {
        return pods[podId].members;
    }

    /**
     * @dev Get user's contribution amount in a pod
     * @param podId ID of the pod
     * @param user Address of the user
     */
    function getMemberContribution(uint256 podId, address user) external view returns (uint256) {
        return pods[podId].memberContributions[user];
    }

    /**
     * @dev Get user's pods
     * @param user Address of the user
     */
    function getUserPods(address user) external view returns (uint256[] memory) {
        return userPods[user];
    }

    /**
     * @dev Get user's contributions
     * @param user Address of the user
     */
    function getUserContributions(address user) external view returns (uint256[] memory) {
        return userContributions[user];
    }

    /**
     * @dev Get contribution details
     * @param contributionId ID of the contribution
     */
    function getContribution(uint256 contributionId) external view returns (
        uint256 id,
        uint256 podId,
        address contributor,
        string memory contributionHash,
        uint256 rewardAmount,
        uint256 timestamp,
        bool isVerified,
        string memory metadata
    ) {
        Contribution storage contribution = contributions[contributionId];
        return (
            contribution.id,
            contribution.podId,
            contribution.contributor,
            contribution.contributionHash,
            contribution.rewardAmount,
            contribution.timestamp,
            contribution.isVerified,
            contribution.metadata
        );
    }

    /**
     * @dev Get proposal details
     * @param proposalId ID of the proposal
     */
    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        uint256 podId,
        address proposer,
        string memory title,
        string memory description,
        uint256 forVotes,
        uint256 againstVotes,
        uint256 endTime,
        bool executed,
        bool canceled
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.podId,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.forVotes,
            proposal.againstVotes,
            proposal.endTime,
            proposal.executed,
            proposal.canceled
        );
    }

    /**
     * @dev Check if user has voted on a proposal
     * @param proposalId ID of the proposal
     * @param user Address of the user
     */
    function hasVoted(uint256 proposalId, address user) external view returns (bool) {
        return proposals[proposalId].hasVoted[user];
    }

    /**
     * @dev Get total number of pods
     */
    function getTotalPods() external view returns (uint256) {
        return _podIds.current();
    }

    /**
     * @dev Get total number of contributions
     */
    function getTotalContributions() external view returns (uint256) {
        return _contributionIds.current();
    }

    /**
     * @dev Get total number of proposals
     */
    function getTotalProposals() external view returns (uint256) {
        return _proposalIds.current();
    }
} 