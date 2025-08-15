import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("ProptyChain Smart Contracts", function () {
  let userRegistry: Contract;
  let propertyFactory: Contract;
  let reviewRegistry: Contract;
  let propertyEscrow: Contract;
  let soulboundNFT: Contract;
  let adminContract: Contract;
  
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contracts
    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy();
    await userRegistry.waitForDeployment();

    const PropertyNFTFactory = await ethers.getContractFactory("PropertyNFTFactory");
    propertyFactory = await PropertyNFTFactory.deploy(await userRegistry.getAddress());
    await propertyFactory.waitForDeployment();

    const ReviewRegistry = await ethers.getContractFactory("ReviewRegistry");
    reviewRegistry = await ReviewRegistry.deploy(await userRegistry.getAddress());
    await reviewRegistry.waitForDeployment();

    const PropertyEscrow = await ethers.getContractFactory("PropertyEscrow");
    propertyEscrow = await PropertyEscrow.deploy(await userRegistry.getAddress(), await propertyFactory.getAddress());
    await propertyEscrow.waitForDeployment();

    const SoulboundNFT = await ethers.getContractFactory("SoulboundNFT");
    soulboundNFT = await SoulboundNFT.deploy(await userRegistry.getAddress());
    await soulboundNFT.waitForDeployment();

    const AdminContract = await ethers.getContractFactory("AdminContract");
    adminContract = await AdminContract.deploy(
      await userRegistry.getAddress(),
      await propertyFactory.getAddress(),
      await reviewRegistry.getAddress(),
      await propertyEscrow.getAddress(),
      await soulboundNFT.getAddress()
    );
    await adminContract.waitForDeployment();
  });

  describe("UserRegistry", function () {
    it("Should allow user registration", async function () {
      await userRegistry.connect(user1).registerUser(
        "John Doe",
        "did:ethr:0x1234567890123456789012345678901234567890",
        0 // SEEKER role
      );

      const user = await userRegistry.getUser(user1.address);
      expect(user.fullName).to.equal("John Doe");
      expect(user.role).to.equal(0); // SEEKER
      expect(user.isActive).to.be.true;
    });

    it("Should prevent duplicate registration", async function () {
      await userRegistry.connect(user1).registerUser(
        "John Doe",
        "did:ethr:0x1234567890123456789012345678901234567890",
        0
      );

      await expect(
        userRegistry.connect(user1).registerUser(
          "John Doe",
          "did:ethr:0x1234567890123456789012345678901234567890",
          0
        )
      ).to.be.revertedWith("User already registered");
    });
  });

  describe("PropertyNFTFactory", function () {
    beforeEach(async function () {
      // Register user first
      await userRegistry.connect(user1).registerUser(
        "John Doe",
        "did:ethr:0x1234567890123456789012345678901234567890",
        1 // OWNER role
      );
    });

    it("Should allow property creation", async function () {
      await propertyFactory.connect(user1).createProperty(
        0, // RESIDENTIAL
        "Lagos, Nigeria",
        ethers.parseEther("100000"),
        "Monthly payment plan",
        "QmHash123",
        "https://metadata.uri"
      );

      const property = await propertyFactory.getProperty(1);
      expect(property.location).to.equal("Lagos, Nigeria");
      expect(property.price).to.equal(ethers.parseEther("100000"));
      expect(property.owner).to.equal(user1.address);
    });

    it("Should enforce upload limits", async function () {
      // Create 2 properties (free limit)
      await propertyFactory.connect(user1).createProperty(
        0, "Lagos, Nigeria", ethers.parseEther("100000"), "Terms", "QmHash1", "https://metadata.uri"
      );
      await propertyFactory.connect(user1).createProperty(
        0, "Abuja, Nigeria", ethers.parseEther("200000"), "Terms", "QmHash2", "https://metadata.uri"
      );

      // Third property should require subscription
      await expect(
        propertyFactory.connect(user1).createProperty(
          0, "Port Harcourt, Nigeria", ethers.parseEther("150000"), "Terms", "QmHash3", "https://metadata.uri"
        )
      ).to.be.revertedWith("Free upload limit reached");
    });
  });

  describe("ReviewRegistry", function () {
    beforeEach(async function () {
      // Register user and create property
      await userRegistry.connect(user1).registerUser("John Doe", "did:ethr:0x123", 1);
      await userRegistry.connect(user2).registerUser("Jane Smith", "did:ethr:0x456", 0);
      
      await propertyFactory.connect(user1).createProperty(
        0, "Lagos, Nigeria", ethers.parseEther("100000"), "Terms", "QmHash", "https://metadata.uri"
      );
    });

    it("Should allow review submission", async function () {
      await reviewRegistry.connect(user2).submitReview(
        1, // propertyId
        0, // RESIDENT review type
        "QmReviewHash",
        5, // rating
        "Property conditions"
      );

      const review = await reviewRegistry.getReview(1);
      expect(review.reviewer).to.equal(user2.address);
      expect(review.rating).to.equal(5);
      expect(review.isValid).to.be.true;
    });

    it("Should prevent duplicate reviews", async function () {
      await reviewRegistry.connect(user2).submitReview(
        1, 0, "QmReviewHash", 5, "Property conditions"
      );

      await expect(
        reviewRegistry.connect(user2).submitReview(
          1, 0, "QmReviewHash2", 4, "Property conditions"
        )
      ).to.be.revertedWith("Already reviewed this property");
    });
  });

  describe("SoulboundNFT", function () {
    beforeEach(async function () {
      await userRegistry.connect(user1).registerUser("John Doe", "did:ethr:0x123", 0);
    });

    it("Should award badges", async function () {
      await soulboundNFT.connect(owner).awardBadge(
        user1.address,
        0, // TRUSTED_OWNER
        "QmBadgeHash",
        1 // level
      );

      const badge = await soulboundNFT.getBadge(1);
      expect(badge.recipient).to.equal(user1.address);
      expect(badge.badgeType).to.equal(0);
      expect(badge.isActive).to.be.true;
    });

    it("Should prevent badge transfers", async function () {
      await soulboundNFT.connect(owner).awardBadge(
        user1.address,
        0, "QmBadgeHash", 1
      );

      await expect(
        soulboundNFT.connect(user1).transferFrom(user1.address, user2.address, 1)
      ).to.be.revertedWith("Soulbound NFTs cannot be transferred");
    });
  });

  describe("AdminContract", function () {
    it("Should manage platform statistics", async function () {
      const stats = await adminContract.getPlatformStats();
      expect(stats.totalUsers).to.equal(0);
      expect(stats.totalProperties).to.equal(0);
      expect(stats.totalReviews).to.equal(0);
    });

    it("Should allow dispute creation", async function () {
      await userRegistry.connect(user1).registerUser("John Doe", "did:ethr:0x123", 0);
      await userRegistry.connect(user2).registerUser("Jane Smith", "did:ethr:0x456", 0);

      await adminContract.connect(user1).createDispute(
        0, // PROPERTY_DISPUTE
        user2.address,
        1, // relatedId
        "QmDisputeHash"
      );

      const dispute = await adminContract.getDispute(1);
      expect(dispute.complainant).to.equal(user1.address);
      expect(dispute.respondent).to.equal(user2.address);
      expect(dispute.status).to.equal(0); // OPEN
    });
  });
});
