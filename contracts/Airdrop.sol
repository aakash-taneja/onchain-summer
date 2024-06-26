// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Airdrop {
    IERC20 public token;

    event AirdropSent(address indexed to, uint256 amount);

    constructor(address _tokenToAirdrop) {
        token = IERC20(_tokenToAirdrop);
    }

    function airdrop() external {
        // require(recipient != address(0), "Invalid recipient");
        uint256 amount = 50000000000000000000;
        token.transferFrom(
            0x3ffeb52F3A1B94D18CB3461AD37E5a698de26138,
            msg.sender,
            amount
        );
        emit AirdropSent(msg.sender, amount);
    }
}
