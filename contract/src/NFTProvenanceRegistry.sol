// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title NFTProvenanceRegistry
 * @notice Stores cryptographic commitments (evidenceHash and provenanceHash) 
 * for off-chain MetaMuse provenance/evidence assessments of Ethereum NFTs.
 * @dev The registry itself is deployed on Monad, while the audited NFTs remain on Ethereum.
 */
contract NFTProvenanceRegistry {
    
    struct Attestation {
        bytes32 evidenceHash;
        bytes32 provenanceHash;
        address attestor;
        uint64 timestamp;
        uint64 version;
    }

    // Mapping from NFT Contract Address => Token ID => List of Attestations (History)
    mapping(address => mapping(uint256 => Attestation[])) private _attestationHistory;

    // Custom errors
    error InvalidNFTContract();
    error InvalidEvidenceHash();
    error InvalidProvenanceHash();
    error AttestationNotFound();

    // Event emitted when a new provenance attestation is registered
    event ProvenanceAttested(
        address indexed nftContract,
        uint256 indexed tokenId,
        uint256 indexed version,
        bytes32 evidenceHash,
        bytes32 provenanceHash,
        address attestor,
        uint256 timestamp
    );

    /**
     * @notice Registers a new provenance attestation for an NFT.
     * @param nftContract The Ethereum contract address of the target NFT.
     * @param tokenId The ERC-721 token ID of the target NFT.
     * @param evidenceHash Cryptographic hash commitment representing the evidence package.
     * @param provenanceHash Cryptographic hash commitment representing the provenance timeline.
     * @return version The version number of the newly created attestation.
     */
    function attestProvenance(
        address nftContract,
        uint256 tokenId,
        bytes32 evidenceHash,
        bytes32 provenanceHash
    ) external returns (uint256 version) {
        if (nftContract == address(0)) revert InvalidNFTContract();
        if (evidenceHash == bytes32(0)) revert InvalidEvidenceHash();
        if (provenanceHash == bytes32(0)) revert InvalidProvenanceHash();

        uint64 nextVersion = uint64(_attestationHistory[nftContract][tokenId].length + 1);

        Attestation memory newAttestation = Attestation({
            evidenceHash: evidenceHash,
            provenanceHash: provenanceHash,
            attestor: msg.sender,
            timestamp: uint64(block.timestamp),
            version: nextVersion
        });

        _attestationHistory[nftContract][tokenId].push(newAttestation);

        emit ProvenanceAttested(
            nftContract,
            tokenId,
            nextVersion,
            evidenceHash,
            provenanceHash,
            msg.sender,
            block.timestamp
        );

        return nextVersion;
    }

    /**
     * @notice Returns the latest attestation registered for a given NFT.
     * @dev If no attestation exists, returns a zero-initialized struct instead of reverting.
     * @param nftContract The address of the NFT contract.
     * @param tokenId The token ID of the NFT.
     * @return The latest Attestation struct.
     */
    function getLatestAttestation(
        address nftContract,
        uint256 tokenId
    ) external view returns (Attestation memory) {
        uint256 length = _attestationHistory[nftContract][tokenId].length;
        if (length == 0) {
            return Attestation({
                evidenceHash: bytes32(0),
                provenanceHash: bytes32(0),
                attestor: address(0),
                timestamp: 0,
                version: 0
            });
        }
        return _attestationHistory[nftContract][tokenId][length - 1];
    }

    /**
     * @notice Returns the complete list of attestations for a given NFT.
     * @param nftContract The address of the NFT contract.
     * @param tokenId The token ID of the NFT.
     * @return An array of Attestation structs.
     */
    function getAttestationHistory(
        address nftContract,
        uint256 tokenId
    ) external view returns (Attestation[] memory) {
        return _attestationHistory[nftContract][tokenId];
    }

    /**
     * @notice Verifies if a given off-chain evidence hash matches the latest recorded attestation commitment.
     * @param nftContract The address of the NFT contract.
     * @param tokenId The token ID of the NFT.
     * @param currentEvidenceHash The current evidence hash to verify.
     * @return True if the evidence hash matches the latest record, false otherwise.
     */
    function verifyAttestation(
        address nftContract,
        uint256 tokenId,
        bytes32 currentEvidenceHash
    ) external view returns (bool) {
        uint256 length = _attestationHistory[nftContract][tokenId].length;
        if (length == 0) {
            return false;
        }
        return _attestationHistory[nftContract][tokenId][length - 1].evidenceHash == currentEvidenceHash;
    }
}
