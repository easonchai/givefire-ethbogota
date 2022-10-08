// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract GiveFire is AccessControl {
    IERC20 token;
    mapping(address => bool) trustedBenefactors;
    mapping(uint256 => Proposal) proposals;
    mapping(uint256 => Group) groups;
    mapping(bytes32 => address) invites; // Unused for now
    uint256 nextGroupId;
    uint256 nextProposalId;

    // Curators can add benefactors to the system
    bytes32 public constant CURATOR_ROLE = keccak256("CURATOR_ROLE");

    // Coordinators can trigger a donation
    bytes32 public constant COORDINATOR_ROLE = keccak256("COORDINATOR_ROLE");
    
    struct Proposal {
        uint256 groupId;
        uint256 startDate;
        uint256 endDate;
        // uint256 votes; // For now, we dont want to store the votes on chain
        address benefactor;
    }

    struct Group {
        address[] donors;
    }

    // Unused for now
    struct Invitation { 
        address invitee;
        uint256 groupId;
    }

    // Benefactor events
    event BenefactorAdded(address benefactor, address curator);
    event BenefactorRemoved(address benefactor, address curator);

    // Proposal events
    event ProposalCreated(uint256 proposalId, uint256 groupId, address proposer, address benefactor);

    // Group events
    event GroupCreated(uint256 groupId, address creator);
    event GroupMemberAdded(uint256 groupId, address newMember, address inviter);
    event GroupMemberLeft(uint256 groupId, address leftMember);

    constructor(IERC20 _token) {
        token = _token;
        _setupRole(CURATOR_ROLE, msg.sender);
        _setupRole(COORDINATOR_ROLE, msg.sender);
    }

    modifier checkGroupFull(uint256 groupId) {
        Group memory group = groups[groupId];
        require(group.donors.length < 5, "Group is full");
        _;
    }

    modifier isCurator() {
        require(hasRole(CURATOR_ROLE, msg.sender), "Caller not a curator");
        _;
    }

    modifier isCoordinator() {
        require(hasRole(COORDINATOR_ROLE, msg.sender), "Caller not a coordinator");
        _;
    }

    modifier isActiveProposal(uint256 proposalId) {
        Proposal memory proposal = proposals[proposalId];
        require (block.timestamp < proposal.endDate, "Proposal has ended");
        _;
    }

    // Not storing votes on chain
    // modifier allHasVoted(uint256 proposalId) {
    //     Proposal memory proposal = proposals[proposalId];
    //     uint256 groupId = proposal.groupId;

    //     Group memory group = groups[groupId];
    //     require(group.donors.length == proposal.votes, "Not enough votes");
    //     _;
    // }

    /**
     * Checks if a benefactor is actually within our system
     */
    function isTrustedBenefactor(address _benefactorAddress) public view returns(bool){
        return trustedBenefactors[_benefactorAddress];
    }

    function addTrustedBenefactor(address _benefactorAddress) public isCurator{
        trustedBenefactors[_benefactorAddress] = true;

        emit BenefactorAdded(_benefactorAddress, msg.sender);
    }

    function removeTrustedBenefactor(address _benefactorAddress) public isCurator{
        trustedBenefactors[_benefactorAddress] = false;

        emit BenefactorRemoved(_benefactorAddress, msg.sender);
    }

    /**
     * Creates a proposal to donate to a benefactor
     */
    function createProposal(address _benefactorAddress, uint256 _groupId) public {
        require(isTrustedBenefactor(_benefactorAddress), "Not a trusted benefactor");

        uint256 startDate = block.timestamp;
        uint256 endDate = startDate + 43200; // 12 hours in the future

        Proposal memory proposal = Proposal(_groupId, startDate, endDate, _benefactorAddress);
        proposals[nextProposalId++] = proposal;

        emit ProposalCreated(nextProposalId - 1, _groupId, msg.sender, _benefactorAddress);
    }

    /**
     * This function will make a request for a token approval based on the amount to donate
     * We don't approve directly to the benefactors address or they can steal it
     * So we will approve ourselves to be able to transfer it later
     */
    // function voteYes(uint256 _donationAmount) public {
    //     // Currently we cap the donation amount to $10. Since we are using stables, we don't need to worry about exchange rates
    //     require(_donationAmount <= 10000000000000000000, "Donation amount too large");
    //     require(_donationAmount >= 1000000000000000000, "Donation amount too little");
    //     if (token.allowance(msg.sender, address(this)) < _donationAmount) {
    //         token.approve(address(this), _donationAmount);
    //     }
    // }

    /**
     * This function actually triggers the donation from all the donors to the specific benefactor
     * Currently, only the coordinators can trigger donations. That is because we will do a sweep at the end of the week
     * We are retrieving the donation amount from our backend. Again, we are assuming trust.
     * Either way, if the amount is too large, the whole donation wouldn't even go through.
     */
    function donate(uint256 _proposalId) public isCoordinator isActiveProposal(_proposalId) {
        // Get the address to donate
        Proposal memory proposal = proposals[_proposalId];
        Group memory group = groups[proposal.groupId];

        uint256 members = group.donors.length;
        // Transfers the funds to us
        for (uint256 i = 0; i < members; i++) {
            token.transferFrom(group.donors[i], proposal.benefactor, token.allowance(group.donors[i], address(this)));
        }

        // Transfers the funds to them
        

        // No need to keep track that the donation has already been passed because we cannot trigger another donation for the said proposal
        // The assumption is that donations happen weekly. Therefore during a sweep, it is only triggered once a week
        // Within that week, the allowance would already be used up
    }

    /**
     * This will create a new donation group
     * It automatically adds the msg.sender as the first donor in the group.
     */
    function createGroup() public {
        // Assign donors
        address[] memory donors = new address[](1);
        donors[0] = msg.sender;
        
        // Set donors to group
        Group memory group;
        group.donors = donors;

        // Push to group
        groups[nextGroupId++] = group;

        emit GroupCreated(nextGroupId - 1, msg.sender);
    }

    /**
     * This function checks if an address is part of a group
     */
    function isGroupMember(uint256 _groupId, address _user) public view returns(bool) {
        Group storage group = groups[_groupId];
        uint256 length = group.donors.length;
        for (uint256 i = 0; i < length; i++) {
            if (group.donors[i] == _user)
                return true;
        }
        return false;
    }

    /**
     * Adds a member to a group
     */
    function addToGroup(uint256 _groupId, address _toAdd) public checkGroupFull(_groupId) {
        Group storage group = groups[_groupId];
        group.donors.push(_toAdd);

        emit GroupMemberAdded(_groupId, _toAdd, msg.sender);
    }

    /**
     * Leaves a group
     */
    function leaveGroup(uint256 _groupId) public {
        require(isGroupMember(_groupId, msg.sender), "Not a member of group");
        
        /**
         * For this, we have to loop through the array and get the index of the member
         * Then, we will replace the index with the last member and pop the array
         */
        Group storage group = groups[_groupId];
        uint256 members = group.donors.length;
        for (uint256 i = 0; i < members; i++) {
            if (group.donors[i] == msg.sender) {
                group.donors[i] = group.donors[members - 1];
                group.donors.pop();
                return;
            }
        }

        emit GroupMemberLeft(_groupId, msg.sender);
    }

    /**
     * Creates an invite token for a user to join a group
     */
    // function inviteToGroup(address memory _toInvite) public {

    // }

    /**
     * Joins a group using an invite token
     */
    // function joinGroup(uint256 _groupId) {

    // }
}