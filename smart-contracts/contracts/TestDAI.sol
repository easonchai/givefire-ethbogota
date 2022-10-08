// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact echai2905@gmail.com
contract GiveFireDAI is ERC20, Ownable {
    constructor() ERC20("GiveFire DAI", "DAI") {
        _mint(msg.sender, 1000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}