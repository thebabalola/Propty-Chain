// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./UserRegistry.sol";
import "./PropertyNFTFactory.sol";

// Handles secure property transactions with escrow functionality
contract PropertyEscrow is Ownable, ReentrancyGuard {

    enum EscrowStatus {
        PENDING,
        FUNDED,
        DISPUTED,
        COMPLETED,
        CANCELLED,
        REFUNDED
    }

    struct Escrow {
        uint256 escrowId;
        uint256 propertyId;
        address buyer;
        address seller;
        uint256 amount;
        uint256 deadline;
        EscrowStatus status;
        uint256 createdAt;
        uint256 completedAt;
        string terms; // IPFS hash for transaction terms
        bool buyerApproved;
        bool sellerApproved;
    }

    struct Dispute {
        uint256 escrowId;
        address disputer;
        string reason; // IPFS hash for dispute details
        uint256 timestamp;
        bool resolved;
    }

    // State variables
    uint256 private _escrowIds;
    mapping(uint256 => Escrow) public escrows;
    mapping(uint256 => Dispute) public disputes;
    mapping(uint256 => uint256) public propertyToEscrow; // propertyId => escrowId
    
    // Dynamic configurable values
    uint256 public escrowDuration = 30 days;
    uint256 public disputeDuration = 7 days;
    uint256 public platformFeePercentage = 2; // 2%
    
    // Contracts
    UserRegistry public userRegistry;
    PropertyNFTFactory public propertyFactory;
    
    // Events
    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed propertyId,
        address indexed buyer,
        address seller,
        uint256 amount
    );
    
    event EscrowFunded(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount
    );
    
    event EscrowCompleted(
        uint256 indexed escrowId,
        address indexed buyer,
        address indexed seller,
        uint256 amount
    );
    
    event EscrowCancelled(
        uint256 indexed escrowId,
        address indexed canceller,
        string reason
    );
    
    event DisputeRaised(
        uint256 indexed escrowId,
        address indexed disputer,
        string reason
    );
    
    event DisputeResolved(
        uint256 indexed escrowId,
        address indexed resolver,
        bool buyerWins
    );
    
    event EscrowRefunded(
        uint256 indexed escrowId,
        address indexed buyer,
        uint256 amount
    );

    event ConfigUpdated(
        string config,
        uint256 oldValue,
        uint256 newValue
    );

    // Modifiers
    modifier onlyRegistered() {
        require(userRegistry.isUserActive(msg.sender), "User not registered or inactive");
        _;
    }

    modifier onlyEscrowParticipant(uint256 escrowId) {
        require(
            escrows[escrowId].buyer == msg.sender || escrows[escrowId].seller == msg.sender,
            "Not escrow participant"
        );
        _;
    }

    modifier onlyActiveEscrow(uint256 escrowId) {
        require(escrows[escrowId].status == EscrowStatus.FUNDED, "Escrow not active");
        _;
    }

    modifier onlyPendingEscrow(uint256 escrowId) {
        require(escrows[escrowId].status == EscrowStatus.PENDING, "Escrow not pending");
        _;
    }

    modifier onlyAdmin() {
        require(owner() == msg.sender, "Only admin can perform this action");
        _;
    }

    // Constructor
    constructor(address _userRegistry, address _propertyFactory) Ownable(msg.sender) {
        userRegistry = UserRegistry(_userRegistry);
        propertyFactory = PropertyNFTFactory(_propertyFactory);
    }

    // Create a new escrow for property purchase
    function createEscrow(
        uint256 propertyId,
        address seller,
        string memory terms
    ) external onlyRegistered {
        require(propertyId > 0, "Invalid property ID");
        require(seller != address(0), "Invalid seller address");
        require(seller != msg.sender, "Cannot create escrow with yourself");
        require(bytes(terms).length > 0, "Terms cannot be empty");
        require(propertyToEscrow[propertyId] == 0, "Property already in escrow");

        // Get property details
        PropertyNFTFactory.PropertyMetadata memory property = propertyFactory.getProperty(propertyId);
        require(property.owner == seller, "Seller is not property owner");
        require(property.isListed, "Property not listed for sale");

        _escrowIds++;
        uint256 escrowId = _escrowIds;

        Escrow memory newEscrow = Escrow({
            escrowId: escrowId,
            propertyId: propertyId,
            buyer: msg.sender,
            seller: seller,
            amount: property.price,
            deadline: block.timestamp + escrowDuration,
            status: EscrowStatus.PENDING,
            createdAt: block.timestamp,
            completedAt: 0,
            terms: terms,
            buyerApproved: false,
            sellerApproved: false
        });

        escrows[escrowId] = newEscrow;
        propertyToEscrow[propertyId] = escrowId;

        emit EscrowCreated(escrowId, propertyId, msg.sender, seller, property.price);
    }

    // Fund the escrow with payment
    function fundEscrow(uint256 escrowId) external payable onlyPendingEscrow(escrowId) {
        Escrow storage escrow = escrows[escrowId];
        require(msg.sender == escrow.buyer, "Only buyer can fund escrow");
        require(msg.value == escrow.amount, "Incorrect payment amount");

        escrow.status = EscrowStatus.FUNDED;

        emit EscrowFunded(escrowId, msg.sender, msg.value);
    }

    // Approve escrow completion
    function approveEscrow(uint256 escrowId) external onlyEscrowParticipant(escrowId) onlyActiveEscrow(escrowId) {
        Escrow storage escrow = escrows[escrowId];
        
        if (msg.sender == escrow.buyer) {
            escrow.buyerApproved = true;
        } else if (msg.sender == escrow.seller) {
            escrow.sellerApproved = true;
        }

        // Complete escrow if both parties approve
        if (escrow.buyerApproved && escrow.sellerApproved) {
            _completeEscrow(escrowId);
        }
    }

    // Raise a dispute
    function raiseDispute(uint256 escrowId, string memory reason) external onlyEscrowParticipant(escrowId) onlyActiveEscrow(escrowId) {
        require(bytes(reason).length > 0, "Dispute reason cannot be empty");

        Escrow storage escrow = escrows[escrowId];
        escrow.status = EscrowStatus.DISPUTED;

        Dispute memory newDispute = Dispute({
            escrowId: escrowId,
            disputer: msg.sender,
            reason: reason,
            timestamp: block.timestamp,
            resolved: false
        });

        disputes[escrowId] = newDispute;

        emit DisputeRaised(escrowId, msg.sender, reason);
    }

    // Resolve dispute (admin only)
    function resolveDispute(uint256 escrowId, bool buyerWins) external onlyAdmin {
        require(escrows[escrowId].status == EscrowStatus.DISPUTED, "Escrow not in dispute");
        require(!disputes[escrowId].resolved, "Dispute already resolved");

        disputes[escrowId].resolved = true;

        if (buyerWins) {
            _refundEscrow(escrowId);
        } else {
            _completeEscrow(escrowId);
        }

        emit DisputeResolved(escrowId, msg.sender, buyerWins);
    }

    // Cancel escrow (only before funding)
    function cancelEscrow(uint256 escrowId, string memory reason) external onlyEscrowParticipant(escrowId) onlyPendingEscrow(escrowId) {
        Escrow storage escrow = escrows[escrowId];
        escrow.status = EscrowStatus.CANCELLED;
        propertyToEscrow[escrow.propertyId] = 0;

        emit EscrowCancelled(escrowId, msg.sender, reason);
    }

    // Get escrow details
    function getEscrow(uint256 escrowId) external view returns (Escrow memory) {
        require(escrowId > 0 && escrowId <= _escrowIds, "Invalid escrow ID");
        return escrows[escrowId];
    }

    // Get dispute details
    function getDispute(uint256 escrowId) external view returns (Dispute memory) {
        return disputes[escrowId];
    }

    // Get escrow ID for a property
    function getEscrowForProperty(uint256 propertyId) external view returns (uint256) {
        return propertyToEscrow[propertyId];
    }

    // Get total number of escrows
    function getTotalEscrows() external view returns (uint256) {
        return _escrowIds;
    }

    // Admin functions to update configurable values
    function updateEscrowDuration(uint256 newDuration) external onlyAdmin {
        uint256 oldDuration = escrowDuration;
        escrowDuration = newDuration;
        emit ConfigUpdated("escrowDuration", oldDuration, newDuration);
    }

    function updateDisputeDuration(uint256 newDuration) external onlyAdmin {
        uint256 oldDuration = disputeDuration;
        disputeDuration = newDuration;
        emit ConfigUpdated("disputeDuration", oldDuration, newDuration);
    }

    function updatePlatformFeePercentage(uint256 newFeePercentage) external onlyAdmin {
        require(newFeePercentage <= 10, "Fee cannot exceed 10%");
        uint256 oldFee = platformFeePercentage;
        platformFeePercentage = newFeePercentage;
        emit ConfigUpdated("platformFeePercentage", oldFee, newFeePercentage);
    }

    // Emergency function to handle stuck escrows (admin only)
    function emergencyRefund(uint256 escrowId) external onlyAdmin {
        Escrow storage escrow = escrows[escrowId];
        require(escrow.status == EscrowStatus.FUNDED, "Escrow not funded");
        require(block.timestamp > escrow.deadline + disputeDuration, "Escrow not expired");

        _refundEscrow(escrowId);
    }

    // Internal function to complete escrow
    function _completeEscrow(uint256 escrowId) internal {
        Escrow storage escrow = escrows[escrowId];
        escrow.status = EscrowStatus.COMPLETED;
        escrow.completedAt = block.timestamp;

        // Calculate platform fee
        uint256 platformFee = (escrow.amount * platformFeePercentage) / 100;
        uint256 sellerAmount = escrow.amount - platformFee;

        // Transfer property NFT
        propertyFactory.transferFrom(escrow.seller, escrow.buyer, escrow.propertyId);

        // Transfer funds
        payable(escrow.seller).transfer(sellerAmount);
        payable(owner()).transfer(platformFee);

        // Clear property escrow mapping
        propertyToEscrow[escrow.propertyId] = 0;

        // Update user reputation
        userRegistry.updateReputation(escrow.buyer, 5, 0); // Positive reputation for successful transaction
        userRegistry.updateReputation(escrow.seller, 5, 0);

        emit EscrowCompleted(escrowId, escrow.buyer, escrow.seller, escrow.amount);
    }

    // Internal function to refund escrow
    function _refundEscrow(uint256 escrowId) internal {
        Escrow storage escrow = escrows[escrowId];
        escrow.status = EscrowStatus.REFUNDED;

        // Refund buyer
        payable(escrow.buyer).transfer(escrow.amount);

        // Clear property escrow mapping
        propertyToEscrow[escrow.propertyId] = 0;

        emit EscrowRefunded(escrowId, escrow.buyer, escrow.amount);
    }
}
