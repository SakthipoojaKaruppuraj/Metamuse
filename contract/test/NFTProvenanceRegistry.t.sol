// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/NFTProvenanceRegistry.sol";

contract NFTProvenanceRegistryTest is Test {
    NFTProvenanceRegistry public registry;
    
    address public constant NFT_CONTRACT_A = 0x7a3F4C9d2b8E1a05C6f3d9E2B7a1c4f5E6D091c2;
    address public constant NFT_CONTRACT_B = 0x1C2Ea64a2757279fc8291c2EA64a2757279fc829;
    uint256 public constant TOKEN_ID_A = 1837;
    uint256 public constant TOKEN_ID_B = 44;

    bytes32 public constant EVIDENCE_HASH_A = keccak256("evidence_package_a");
    bytes32 public constant EVIDENCE_HASH_B = keccak256("evidence_package_b");
    bytes32 public constant EVIDENCE_HASH_C = keccak256("evidence_package_c");
    
    bytes32 public constant PROVENANCE_HASH_X = keccak256("provenance_timeline_x");
    bytes32 public constant PROVENANCE_HASH_Y = keccak256("provenance_timeline_y");

    event ProvenanceAttested(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 indexed version,
        bytes32 evidenceHash,
        bytes32 provenanceHash,
        address attestor,
        uint256 timestamp
    );

    function setUp() public {
        registry = new NFTProvenanceRegistry();
    }

    // TEST 1 — Deployment
    function test_Deployment() public view {
        assertTrue(address(registry) != address(0));
    }

    // TEST 2 — Empty NFT
    // getLatestAttestation() returns a zero/default struct.
    // verifyAttestation() returns false.
    function test_EmptyNFT() public view {
        NFTProvenanceRegistry.Attestation memory latest = registry.getLatestAttestation(NFT_CONTRACT_A, TOKEN_ID_A);
        assertEq(latest.evidenceHash, bytes32(0));
        assertEq(latest.provenanceHash, bytes32(0));
        assertEq(latest.attestor, address(0));
        assertEq(latest.timestamp, 0);
        assertEq(latest.version, 0);

        bool verified = registry.verifyAttestation(NFT_CONTRACT_A, TOKEN_ID_A, EVIDENCE_HASH_A);
        assertFalse(verified);
    }

    // TEST 3 — First Attestation
    // Verify version == 1
    function test_FirstAttestation() public {
        uint256 version = registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
        assertEq(version, 1);
    }

    // TEST 4 — Attestor
    // Verify attestor == msg.sender
    function test_Attestor() public {
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
        NFTProvenanceRegistry.Attestation memory latest = registry.getLatestAttestation(NFT_CONTRACT_A, TOKEN_ID_A);
        assertEq(latest.attestor, address(this));
    }

    // TEST 5 — Timestamp
    // Verify timestamp is correct (use vm.warp)
    function test_Timestamp() public {
        uint256 newTime = 1718239012;
        vm.warp(newTime);
        
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
        
        NFTProvenanceRegistry.Attestation memory latest = registry.getLatestAttestation(NFT_CONTRACT_A, TOKEN_ID_A);
        assertEq(latest.timestamp, newTime);
    }

    // TEST 6 — Event
    // Verify ProvenanceAttested contains correct data
    function test_EventEmission() public {
        uint256 currentTime = block.timestamp;
        
        vm.expectEmit(true, true, true, true);
        emit ProvenanceAttested(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            1, // version
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X,
            address(this),
            currentTime
        );

        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
    }

    // TEST 7 — Latest Attestation
    // Verify every field returned by getLatestAttestation()
    function test_LatestAttestationFields() public {
        uint256 currentTime = block.timestamp;
        
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );

        NFTProvenanceRegistry.Attestation memory latest = registry.getLatestAttestation(NFT_CONTRACT_A, TOKEN_ID_A);
        assertEq(latest.evidenceHash, EVIDENCE_HASH_A);
        assertEq(latest.provenanceHash, PROVENANCE_HASH_X);
        assertEq(latest.attestor, address(this));
        assertEq(latest.timestamp, currentTime);
        assertEq(latest.version, 1);
    }

    // TEST 8 — Second Attestation
    // Verify version == 2
    function test_SecondAttestation() public {
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
        
        uint256 version2 = registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_B,
            PROVENANCE_HASH_Y
        );
        
        assertEq(version2, 2);
    }

    // TEST 9 — Historical Immutability
    // Verify version 1 still contains A/X
    // TEST 10 — Latest Updated
    // Verify latest contains B/Y
    function test_HistoricalImmutabilityAndLatestUpdate() public {
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
        
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_B,
            PROVENANCE_HASH_Y
        );

        // Verify latest contains version 2 (B/Y)
        NFTProvenanceRegistry.Attestation memory latest = registry.getLatestAttestation(NFT_CONTRACT_A, TOKEN_ID_A);
        assertEq(latest.version, 2);
        assertEq(latest.evidenceHash, EVIDENCE_HASH_B);
        assertEq(latest.provenanceHash, PROVENANCE_HASH_Y);

        // Retrieve full history and check version 1
        NFTProvenanceRegistry.Attestation[] memory history = registry.getAttestationHistory(NFT_CONTRACT_A, TOKEN_ID_A);
        assertEq(history.length, 2);
        assertEq(history[0].version, 1);
        assertEq(history[0].evidenceHash, EVIDENCE_HASH_A);
        assertEq(history[0].provenanceHash, PROVENANCE_HASH_X);
    }

    // TEST 11 — History
    // getAttestationHistory() must contain version 1 and 2
    function test_GetAttestationHistory() public {
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
        
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_B,
            PROVENANCE_HASH_Y
        );

        NFTProvenanceRegistry.Attestation[] memory history = registry.getAttestationHistory(NFT_CONTRACT_A, TOKEN_ID_A);
        assertEq(history.length, 2);
        assertEq(history[0].version, 1);
        assertEq(history[1].version, 2);
    }

    // TEST 12 — MATCH
    // verifyAttestation(..., B) must return true
    function test_VerificationMatch() public {
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
        
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_B,
            PROVENANCE_HASH_Y
        );

        bool isMatch = registry.verifyAttestation(NFT_CONTRACT_A, TOKEN_ID_A, EVIDENCE_HASH_B);
        assertTrue(isMatch);
    }

    // TEST 13 — MISMATCH
    // verifyAttestation(..., C) must return false
    function test_VerificationMismatch() public {
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );

        bool isMatch = registry.verifyAttestation(NFT_CONTRACT_A, TOKEN_ID_A, EVIDENCE_HASH_C);
        assertFalse(isMatch);
    }

    // TEST 14 — Invalid NFT Contract
    // address(0) must revert: InvalidNFTContract()
    function test_RevertInvalidNFTContract() public {
        vm.expectRevert(NFTProvenanceRegistry.InvalidNFTContract.selector);
        registry.attestProvenance(
            address(0),
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
    }

    // TEST 15 — Invalid Evidence Hash
    // bytes32(0) must revert: InvalidEvidenceHash()
    function test_RevertInvalidEvidenceHash() public {
        vm.expectRevert(NFTProvenanceRegistry.InvalidEvidenceHash.selector);
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            bytes32(0),
            PROVENANCE_HASH_X
        );
    }

    // TEST 16 — Invalid Provenance Hash
    // bytes32(0) must revert: InvalidProvenanceHash()
    function test_RevertInvalidProvenanceHash() public {
        vm.expectRevert(NFTProvenanceRegistry.InvalidProvenanceHash.selector);
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            bytes32(0)
        );
    }

    // TEST 17 — Token ID Zero
    // tokenId = 0 must succeed
    function test_TokenIdZeroSucceeds() public {
        uint256 version = registry.attestProvenance(
            NFT_CONTRACT_A,
            0,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );
        assertEq(version, 1);
        
        NFTProvenanceRegistry.Attestation memory latest = registry.getLatestAttestation(NFT_CONTRACT_A, 0);
        assertEq(latest.version, 1);
    }

    // TEST 18 — Multiple NFTs
    // NFT A (#1837) and NFT B (#44) remain independent
    function test_MultipleNFTsAreIndependent() public {
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );

        registry.attestProvenance(
            NFT_CONTRACT_B,
            TOKEN_ID_B,
            EVIDENCE_HASH_B,
            PROVENANCE_HASH_Y
        );

        NFTProvenanceRegistry.Attestation memory latestA = registry.getLatestAttestation(NFT_CONTRACT_A, TOKEN_ID_A);
        NFTProvenanceRegistry.Attestation memory latestB = registry.getLatestAttestation(NFT_CONTRACT_B, TOKEN_ID_B);

        assertEq(latestA.version, 1);
        assertEq(latestA.evidenceHash, EVIDENCE_HASH_A);

        assertEq(latestB.version, 1);
        assertEq(latestB.evidenceHash, EVIDENCE_HASH_B);
    }

    // TEST 19 — Multiple Attestors
    // Use vm.prank() to create attestations from different addresses and verify correctly recorded
    function test_MultipleAttestors() public {
        address user1 = address(0x99);
        address user2 = address(0xAA);

        vm.prank(user1);
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_A,
            PROVENANCE_HASH_X
        );

        vm.prank(user2);
        registry.attestProvenance(
            NFT_CONTRACT_A,
            TOKEN_ID_A,
            EVIDENCE_HASH_B,
            PROVENANCE_HASH_Y
        );

        NFTProvenanceRegistry.Attestation[] memory history = registry.getAttestationHistory(NFT_CONTRACT_A, TOKEN_ID_A);
        assertEq(history[0].attestor, user1);
        assertEq(history[1].attestor, user2);
    }

    // Fuzz Testing: arbitrary non-zero token IDs and hashes
    function testFuzz_Attestation(
        address nftContract,
        uint256 tokenId,
        bytes32 evidenceHash,
        bytes32 provenanceHash
    ) public {
        // Exclude invalid input scenarios which are tested separately
        vm.assume(nftContract != address(0));
        vm.assume(evidenceHash != bytes32(0));
        vm.assume(provenanceHash != bytes32(0));

        uint256 version = registry.attestProvenance(
            nftContract,
            tokenId,
            evidenceHash,
            provenanceHash
        );
        
        assertEq(version, 1);

        NFTProvenanceRegistry.Attestation memory latest = registry.getLatestAttestation(nftContract, tokenId);
        assertEq(latest.version, 1);
        assertEq(latest.evidenceHash, evidenceHash);
        assertEq(latest.provenanceHash, provenanceHash);
        assertEq(latest.attestor, address(this));

        assertTrue(registry.verifyAttestation(nftContract, tokenId, evidenceHash));
    }
}
