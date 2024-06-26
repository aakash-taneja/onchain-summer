// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./NFTWithAffiliates.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OnChainAd is Ownable {
    struct Ad {
        string adId;
        address owner;
        string contentUri;
        int256 balance; // Changed to int256 to allow negative balances
        bool isPaused;
        bool isStoppedByNetwork;
        bool removalRequested;
    }

    IERC20 public paymentToken;
    uint256 public totalNetworkBalance;
    uint256 public totalActiveAds;

    mapping(string => Ad) public adIdToAd;
    mapping(string => uint256) public adToNetworkShare;

    event AdCreated(
        string adId,
        address owner,
        string contentUri,
        int256 balance
    );
    event AdRemoved(string adId, address owner);
    event AdPaused(string adId, address owner);
    event AdResumed(string adId, address owner);
    event AdStopped(string adId, address owner);
    event AdFeeDeducted(string adId, uint256 feeAmount);
    event AdBalanceWithdrawn(string adId, address owner, uint256 amount);
    event AdNetworkShareWithdrawn(string adId, uint256 amount);
    event TotalNetworkBalanceWithdrawn(uint256 amount);
    event AdBalanceToppedUp(string adId, address owner, uint256 amount);
    event AdRemovalRequested(string adId, address owner);

    constructor(address _paymentToken) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
    }

    function createAd(
        string memory _adId,
        string memory _contentUri,
        uint256 _adBalance
    ) public {
        require(
            paymentToken.transferFrom(msg.sender, address(this), _adBalance),
            "Ad balance payment failed"
        );

        adIdToAd[_adId] = Ad({
            adId: _adId,
            owner: msg.sender,
            contentUri: _contentUri,
            balance: int256(_adBalance), // Store as int256
            isPaused: false,
            isStoppedByNetwork: false,
            removalRequested: false
        });

        totalNetworkBalance += _adBalance;
        totalActiveAds++;

        emit AdCreated(_adId, msg.sender, _contentUri, ads[_adId].balance);
    }

    function requestAdRemoval(string memory _adId) public {
        Ad storage ad = adIdToAd[_adId];
        require(
            ad.owner == msg.sender,
            "Only the ad owner can request removal"
        );
        require(!ad.removalRequested, "Ad removal already requested");

        ad.removalRequested = true;
        ad.isPaused = true;
        totalActiveAds--;

        emit AdPaused(_adId, msg.sender);
        emit AdRemovalRequested(_adId, msg.sender);
    }

    function removeAd(string memory _adId) public onlyOwner {
        Ad storage ad = ads[_adId];
        require(ad.removalRequested, "Ad removal not requested by owner");

        uint256 creatorBalance = ad.balance >= 0 ? uint256(ad.balance) : 0;
        uint256 networkShare = adToNetworkShare[_adId];

        // Payout to creator
        if (creatorBalance > 0) {
            paymentToken.transfer(ad.owner, creatorBalance);
            emit AdBalanceWithdrawn(_adId, ad.owner, creatorBalance);
        }

        // Payout to network
        if (networkShare > 0) {
            totalNetworkBalance -= networkShare;
            paymentToken.transfer(owner(), networkShare);
            emit AdNetworkShareWithdrawn(_adId, networkShare);
        }

        delete adIdToAd[_adId];
        delete adToNetworkShare[_adId];

        emit AdRemoved(_adId, ad.owner);
    }

    function pauseAd(string memory _adId) public {
        Ad storage ad = adIdToAd[_adId];
        require(ad.owner == msg.sender, "Only the owner can pause this ad");
        require(!ad.isPaused, "Ad is already paused");

        ad.isPaused = true;
        totalActiveAds--;

        emit AdPaused(_adId, msg.sender);
    }

    function resumeAd(string memory _adId) public {
        Ad storage ad = adIdToAd[_adId];
        require(ad.owner == msg.sender, "Only the owner can resume this ad");
        require(ad.isPaused, "Ad is not paused");

        ad.isPaused = false;
        totalActiveAds++;

        emit AdResumed(_adId, msg.sender);
    }

    function getAd(string memory _adId) public view returns (Ad memory) {
        return adIdToAd[_adId];
    }

    function deductAdFee(
        string memory _adId,
        uint256 feeAmount
    ) public onlyOwner {
        Ad storage ad = adIdToAd[_adId];

        ad.balance -= int256(feeAmount);
        adToNetworkShare[_adId] += feeAmount;
        totalNetworkBalance += feeAmount;

        if (ad.balance <= 0) {
            stopAdByNetwork(_adId);
        }

        emit AdFeeDeducted(_adId, feeAmount);
    }

    function withdrawAdBalance(string memory _adId, uint256 amount) public {
        Ad storage ad = adIdToAd[_adId];
        require(
            ad.owner == msg.sender,
            "Only the owner can withdraw the ad balance"
        );
        require(
            ad.balance >= int256(amount),
            "Insufficient balance to withdraw"
        );

        uint256 withdrawAmount = amount;
        if (amount == 0) {
            withdrawAmount = uint256(ad.balance);
            ad.balance = 0;
            ad.isPaused = true;
            totalActiveAds--;
        } else {
            ad.balance -= int256(amount);
        }

        if (ad.balance <= 0) {
            stopAdByNetwork(_adId);
        }

        paymentToken.transfer(msg.sender, withdrawAmount);
        totalNetworkBalance -= withdrawAmount;

        emit AdBalanceWithdrawn(_adId, msg.sender, withdrawAmount);
    }

    function withdrawAdNetworkShare(string memory _adId) public onlyOwner {
        uint256 balance = adToNetworkShare[_adId];
        require(balance > 0, "No network share to withdraw");

        adToNetworkShare[_adId] = 0;
        totalNetworkBalance -= balance;
        paymentToken.transfer(owner(), balance);

        emit AdNetworkShareWithdrawn(_adId, balance);
    }

    function withdrawTotalNetworkBalance() public onlyOwner {
        uint256 balance = totalNetworkBalance;
        require(balance > 0, "No total network balance to withdraw");

        totalNetworkBalance = 0;
        paymentToken.transfer(owner(), balance);

        emit TotalNetworkBalanceWithdrawn(balance);
    }

    function topUpAdBalance(string memory _adId, uint256 amount) public {
        Ad storage ad = adIdToAd[_adId];
        require(
            ad.owner == msg.sender,
            "Only the ad owner can top up the ad balance"
        );
        require(
            paymentToken.transferFrom(msg.sender, address(this), amount),
            "Top-up payment failed"
        );

        ad.balance += int256(amount);
        ad.isPaused = false;
        ad.isStoppedByNetwork = false;

        emit AdBalanceToppedUp(_adId, msg.sender, amount);
    }

    function stopAdByNetwork(string memory _adId) internal {
        Ad storage ad = adIdToAd[_adId];
        ad.isStoppedByNetwork = true;
        totalActiveAds--;

        emit AdStopped(_adId, ad.owner);
    }
}
