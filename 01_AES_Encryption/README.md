# Experiment 1: AES-256-CBC Symmetric Encryption

## 1. Concept Overview
- **AES (Advanced Encryption Standard)**: A symmetric block cipher standardized by NIST in 2001.
- **Symmetric Cipher**: The exact same key is used for both encryption and decryption.
- **Key Length**: 256 bits (32 bytes), providing military-grade security against brute-force attacks.
- **Mode of Operation**: CBC (Cipher Block Chaining). Each block of plaintext is XORed with the previous ciphertext block before encryption, ensuring identical plaintext blocks produce distinct ciphertext blocks.
- **Key Derivation**: PBKDF2 (Password-Based Key Derivation Function 2) with 100,000 iterations and random salt to prevent rainbow table attacks.

---

## 2. Steps to Demonstrate in Presentation

1. **Navigate to Folder**:
   ```cmd
   cd 01_AES_Encryption
   ```
2. **Display Original Message**:
   ```cmd
   type message.txt
   ```
3. **Encrypt the File using AES-256-CBC**:
   ```cmd
   openssl enc -aes-256-cbc -salt -pbkdf2 -iter 100000 -in message.txt -out encrypted.bin
   ```
   *(Enter a password when prompted)*
4. **Inspect Ciphertext**:
   ```cmd
   type encrypted.bin
   ```
   *(Observe that content is unreadable scrambled binary data)*
5. **Decrypt the File**:
   ```cmd
   openssl enc -d -aes-256-cbc -pbkdf2 -iter 100000 -in encrypted.bin -out decrypted.txt
   ```
   *(Enter the same password used during encryption)*
6. **Compare Original and Decrypted Files**:
   ```cmd
   fc /b message.txt decrypted.txt
   ```

---

## 3. Expected Result
```
Comparing files message.txt and DECRYPTED.TXT
FC: no differences encountered
```
This proves the decrypted file is 100% bit-for-bit identical to the original message.

---

## 4. Key Parameters Breakdown
| Flag / Parameter | Purpose |
| :--- | :--- |
| `enc -aes-256-cbc` | Specifies symmetric encryption with AES-256 in CBC mode. |
| `-salt` | Adds an 8-byte random salt to prevent precomputed dictionary/rainbow attacks. |
| `-pbkdf2` | Uses PBKDF2 standard instead of legacy single-digest MD5/SHA key derivation. |
| `-iter 100000` | Applies 100,000 hash iterations to make brute-force attacks computationally infeasible. |
| `-in / -out` | Specifies input and output file paths. |
| `-d` | Decrypts ciphertext back to plaintext. |

---

## 5. Viva / Oral Questions & Answers
- **Q1: Why is AES called a symmetric cipher?**  
  *Answer:* Because both the sender and receiver share and use the exact same secret key for encryption and decryption.
- **Q2: Why is CBC mode preferred over ECB mode?**  
  *Answer:* Electronic Codebook (ECB) encrypts identical plaintext blocks into identical ciphertext blocks (leaking patterns, like the famous ECB penguin). CBC XORs each plaintext block with the previous ciphertext block, masking patterns.
- **Q3: What is the purpose of salt in PBKDF2?**  
  *Answer:* Salt introduces cryptographic randomness so that two users using the same password will produce completely different derived keys and ciphertexts.
