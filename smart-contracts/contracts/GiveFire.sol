// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract GiveFire {
    IERC20 token;
    mapping(address => bool) trustedBenefactors;
    mapping(uint256 => Proposal) proposals;
    mapping(uint256 => Group) groups;
    mapping(bytes32 => address) invites; // Unused for now
    uint256 nextGroupId;
    uint256 nextProposalId;
    
    struct Proposal {
        uint256 groupId;
        uint256 endDate;
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

    event GroupCreated(uint256 groupId, address creator);
    event GroupMemberAdded(uint256 groupId, address newMember, address inviter);
    event GroupMemberLeft(uint256 groupId, address leftMember);

    constructor(IERC20 _token) {
        token = _token;
    }

    modifier checkGroupFull(uint256 groupId) {
        Group memory group = groups[groupId];
        require(group.donors.length < 5, "Group is full");
        _;
    }

    function isTrustedBenefactor(address _benefactorAddress) public view returns(bool){
        return trustedBenefactors[_benefactorAddress];
    }

    /**
     * This function will make a request for a token approval based on the amount to donate
     */
    function voteYes(uint256 _donationAmount) public {
        if (token.allowance(msg.sender, address(this)) < _donationAmount) {
            token.approve(address(this), _donationAmount);
        } 
    }

    /**
     * This function actually triggers the donation from all the donors to the specific benefactor
     */
    function donate(uint256 _proposalId) public {

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