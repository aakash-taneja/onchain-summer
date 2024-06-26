// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NFTWithAffiliates is ERC1155, Ownable(msg.sender) {
    // using Counters for Counters.Counter;
    uint256 private _tokenIds;

    IERC20 public paymentToken;

    struct NFTData {
        string uri;
        uint256 mintingFee;
        uint256 maxSupply;
        uint256 currentSupply;
    }

    mapping(string => uint256) public adIdToNftId;
    mapping(uint256 => NFTData) public nftData;
    mapping(uint256 => address) public nftCreators;
    mapping(address => uint256) public affiliateBalances;
    mapping(address => uint256) public creatorBalances;
    uint256 public networkBalances;

    event Minted(
        uint256 tokenId,
        address creator,
        address affiliate,
        uint256 mintingFee
    );

    constructor(address _paymentToken) ERC1155("") {
        paymentToken = IERC20(_paymentToken);
    }

    function addNFT(
        string memory adId,
        string memory tokenURI,
        uint256 mintingFee,
        uint256 maxSupply
    ) public {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        nftData[newTokenId] = NFTData({
            uri: tokenURI,
            mintingFee: mintingFee,
            maxSupply: maxSupply,
            currentSupply: 0
        });

        adIdToNftId[adId] = newTokenId;

        emit URI(tokenURI, newTokenId);
    }

    function mintNFT(uint256 nftId, address affiliate, uint256 amount) public {
        require(bytes(nftData[nftId].uri).length != 0, "NFT not defined");
        require(
            paymentToken.transferFrom(
                msg.sender,
                address(this),
                nftData[nftId].mintingFee * amount
            ),
            "Payment failed"
        );
        require(
            nftData[nftId].currentSupply + amount <= nftData[nftId].maxSupply,
            "Exceeds max supply"
        );

        // Store the creator's details
        nftCreators[nftId] = msg.sender;

        // Calculate the shares
        uint256 totalMintingFee = nftData[nftId].mintingFee * amount;
        uint256 affiliateShare = totalMintingFee / 10;
        uint256 creatorShare;
        uint256 networkShare;

        if (affiliate == address(0)) {
            creatorShare = (totalMintingFee * 9) / 10;
            networkShare = totalMintingFee / 10;
        } else {
            creatorShare = (totalMintingFee * 8) / 10;
            networkShare = totalMintingFee / 10;
            affiliateBalances[affiliate] += affiliateShare;
        }

        // Distribute to creatorBalances
        creatorBalances[nftCreators[nftId]] += creatorShare;
        networkBalances += networkShare;

        // Mint the NFT
        _mint(msg.sender, nftId, amount, "");

        // Update current supply
        nftData[nftId].currentSupply += amount;

        emit Minted(nftId, msg.sender, affiliate, totalMintingFee);
    }

    function withdrawAffiliateEarnings() public {
        uint256 amount = affiliateBalances[msg.sender];
        require(amount > 0, "No earnings to withdraw");

        affiliateBalances[msg.sender] = 0;
        paymentToken.transfer(msg.sender, amount);
    }

    function withdrawCreatorEarnings() public {
        uint256 amount = creatorBalances[msg.sender];
        require(amount > 0, "No earnings to withdraw");

        creatorBalances[msg.sender] = 0;
        paymentToken.transfer(msg.sender, amount);
    }

    function setMintingFee(uint256 nftId, uint256 newFee) public {
        require(bytes(nftData[nftId].uri).length != 0, "NFT not defined");
        require(
            msg.sender == nftCreators[nftId] || msg.sender == owner(),
            "Caller is not the creator of the NFT"
        );
        nftData[nftId].mintingFee = newFee;
    }

    function setMaxSupply(uint256 nftId, uint256 maxSupply) public {
        require(bytes(nftData[nftId].uri).length != 0, "NFT not defined");
        require(
            msg.sender == nftCreators[nftId] || msg.sender == owner(),
            "Caller is not the creator of the NFT"
        );
        require(
            nftData[nftId].currentSupply <= maxSupply,
            "Current supply exceeds new max supply"
        );
        nftData[nftId].maxSupply = maxSupply;
    }

    function setTokenURI(
        uint256 nftId,
        string memory tokenURI
    ) public onlyOwner {
        require(bytes(nftData[nftId].uri).length != 0, "NFT not defined");
        nftData[nftId].uri = tokenURI;
        emit URI(tokenURI, nftId);
    }

    function withdrawNetworkEarnings() public onlyOwner {
        uint256 amount = networkBalances;
        require(amount > 0, "No earnings to withdraw");

        networkBalances = 0;
        paymentToken.transfer(owner(), amount);
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return nftData[tokenId].uri;
    }

    function transferTokens(
        address to,
        uint256 tokenId,
        uint256 amount
    ) public {
        safeTransferFrom(msg.sender, to, tokenId, amount, "");
    }
}
