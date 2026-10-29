# Blockchain Evidence System

A blockchain-inspired digital evidence management platform built with React.js to demonstrate data integrity, tamper detection, and traceability through a custom blockchain simulation.

## Overview

The Blockchain Evidence System explores how blockchain principles can be applied to digital evidence management. Designed for investigation teams and law enforcement use cases, the application provides an interface for recording evidence, tracking records, and checking whether stored information has been modified.

Each evidence submission is incorporated into a simulated blockchain using hash generation and block linking. Users can inspect the chain and validate its integrity to identify potential tampering.

**Note:** This project demonstrates blockchain concepts through a custom simulation. It is not a production-ready evidence storage system or a substitute for a cryptographically secured, deployed blockchain network.

## Features

- **Evidence Submission:** Record case details, officer information, and evidence location.
- **Blockchain Simulation:** Represent evidence records as linked blocks using hashes.
- **Integrity Verification:** Validate the chain to detect changes to stored records.
- **Evidence Records Dashboard:** Search and review evidence entries.
- **Blockchain Explorer:** Inspect blocks and their associated metadata.
- **Tamper Detection:** Demonstrate how modifying a record can affect blockchain integrity.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | User interface and component-based development |
| Tailwind CSS | Styling and responsive layouts |
| Lucide React | Interface icons |
| JavaScript | Evidence handling and blockchain simulation logic |

The blockchain structure and validation logic are custom-built without relying on an external blockchain framework.

## How It Works

1. **Submit evidence:** Enter the relevant case, officer, and location details.
2. **Generate a hash:** Create a hash for the evidence record using the implemented logic.
3. **Create a block:** Associate the record with a block in the simulated chain.
4. **Link blocks:** Maintain references between blocks to represent the chain structure.
5. **Verify integrity:** Validate the chain to identify inconsistencies that may indicate tampering.
6. **Review records:** Browse the available evidence and inspect block metadata.

## Project Vision

Digital evidence must be handled with care because record integrity and traceability are essential to investigations. This project explores how blockchain concepts can help demonstrate a transparent approach to tracking evidence records and detecting unauthorized modifications.

Developed as part of the **Kaaval Hackathon**, the project applies fundamental blockchain principles to a practical security-focused use case.

## Key Learnings

- Understanding hashing and linked-block data structures.
- Applying blockchain concepts to evidence integrity verification.
- Managing application state and building reusable React components.
- Designing interfaces for structured records and technical workflows.
- Exploring the role of transparency and tamper detection in digital systems.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/minhuparthasarathy/BLOCKCHAIN-EVIDENCE-SYSTEM.git
cd BLOCKCHAIN-EVIDENCE-SYSTEM
```

The repository currently contains `BlockchainEvidenceSystem.jsx` and does not list a `package.json`. To run the application, open the JSX file and identify the intended React environment and dependencies. If it was created for an existing React project, place the component in that project and install the required dependencies there.

## Future Improvements

- Integrate persistent evidence storage.
- Use established cryptographic hashing algorithms for evidence integrity checks.
- Add role-based access control and authentication.
- Record a detailed audit trail for evidence-related actions.
- Explore integration with a deployed blockchain network.
- Strengthen evidence handling with secure storage and appropriate access controls.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Built during the Kaaval Hackathon as a learning project exploring blockchain-inspired evidence management.
