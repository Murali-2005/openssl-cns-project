# Experiment 2: RSA-2048 Asymmetric Cryptography

## 1. Concept Overview
- **RSA (Rivest–Shamir–Adleman)**: An asymmetric cryptographic algorithm based on the practical difficulty of factoring the product of two large prime numbers.
- **Asymmetric Key Pair**:
  - **Public Key**: Shared publicly with anyone who wants to send encrypted data to you or verify your signature.
  - **Private Key**: Kept strictly confidential by the owner; used for decrypting data encrypted with the public key or signing data.
- **Key Length**: 2048 bits (current industry standard for secure RSA).
- **Padding Mode**: OAEP (Optimal Asymmetric Encryption Padding) with SHA-256. OAEP adds randomness and structure to prevent mathematical and chosen-ciphertext attacks (e.g., Bleichenbacher attacks).

---

## 2. Steps to Demonstrate in Presentation

1. **Navigate to Folder**:
   ```cmd
   cd 02_RSA_Cryptography
   ```
2. **Generate Private Key**:
   ```cmd
   openssl genpkey -algorithm RSA -out private.pem -pkeyopt rsa_keygen_bits:2048
   ```
3. **Extract Public Key**:
   ```cmd
   openssl pkey -in private.pem -pubout -out public.pem
   ```
4. **Encrypt using Public Key**:
   ```cmd
   openssl pkeyutl -encrypt -pubin -inkey public.pem -in message.txt -out encrypted.bin -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
   ```
5. **Decrypt using Private Key**:
   ```cmd
   openssl pkeyutl -decrypt -inkey private.pem -in encrypted.bin -out decrypted.txt -pkeyopt rsa_padding_mode:oaep -pkeyopt rsa_oaep_md:sha256
   ```
6. **Compare Files**:
   ```cmd
   fc /b message.txt decrypted.txt
   ```

---

## 3. Expected Result
```
Comparing files message.txt and DECRYPTED.TXT
FC: no differences encountered
```

---

## 4. Key Parameters Breakdown
| Command / Parameter | Purpose |
| :--- | :--- |
| `genpkey -algorithm RSA` | Generates a private key using the modern EVP key generation engine. |
| `rsa_keygen_bits:2048` | Specifies key size as 2048 bits. |
| `pkey -pubout` | Reads the private key and outputs only the corresponding public key. |
| `pkeyutl -encrypt -pubin` | Performs public key operation (encryption) using the public key file. |
| `pkeyutl -decrypt` | Performs private key operation (decryption) using the private key file. |
| `rsa_padding_mode:oaep` | Applies Optimal Asymmetric Encryption Padding (recommended standard). |
| `rsa_oaep_md:sha256` | Uses SHA-256 hash function inside OAEP mask generation. |

---

## 5. Viva / Oral Questions & Answers
- **Q1: Why can't we use RSA to encrypt large video or PDF files directly?**  
  *Answer:* RSA is computationally slow (involves modular exponentiation of huge numbers) and has a strict maximum payload size bounded by its key size (for 2048-bit RSA with OAEP-SHA256, max payload is $256 - 2 \times 32 - 2 = 190$ bytes). In real-world systems, we use **Hybrid Encryption**: AES encrypts the large file, and RSA encrypts the AES key.
- **Q2: Why must we use OAEP padding instead of PKCS#1 v1.5?**  
  *Answer:* PKCS#1 v1.5 padding is vulnerable to padding oracle attacks (Bleichenbacher's attack). OAEP introduces probabilistic masking and collision resistance, preventing attackers from learning plaintext relations.
- **Q3: What happens if the private key is lost or leaked?**  
  *Answer:* If lost, encrypted data can never be decrypted. If leaked, an attacker can decrypt all past and future intercepted messages.
