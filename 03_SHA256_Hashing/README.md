# Experiment 3: SHA-256 Hashing and Avalanche Effect

## 1. Concept Overview
- **SHA (Secure Hash Algorithm)**: A family of cryptographic hash functions designed by the NSA and published by NIST.
- **SHA-256**: Generates a unique, fixed-size 256-bit (32 bytes / 64 hexadecimal characters) hash digest regardless of input file size.
- **Key Cryptographic Properties**:
  1. **One-Way (Pre-image Resistance)**: Infeasible to reverse the hash back to the original message.
  2. **Deterministic**: The same input will always produce the exact same hash value.
  3. **Second Pre-image Resistance**: Infeasible to find a different message that hashes to the same value.
  4. **Collision Resistance**: Infeasible to find two arbitrary messages that yield the same hash value.
  5. **Avalanche Effect**: Flipping even a single bit in the input dramatically alters more than 50% of the output bits.

---

## 2. Steps to Demonstrate in Presentation

1. **Navigate to Folder**:
   ```cmd
   cd 03_SHA256_Hashing
   ```
2. **View Original File**:
   ```cmd
   type original.txt
   ```
3. **Compute and Save Original Hash**:
   ```cmd
   openssl dgst -sha256 original.txt > original_hash.txt
   type original_hash.txt
   ```
4. **Tamper with Original File**:
   ```cmd
   echo Tampered data >> original.txt
   type original.txt
   ```
5. **Compute and Save Modified Hash**:
   ```cmd
   openssl dgst -sha256 original.txt > modified_hash.txt
   type modified_hash.txt
   ```
6. **Compare Hashes to Prove Avalanche Effect**:
   ```cmd
   fc /b original_hash.txt modified_hash.txt
   ```

---

## 3. Expected Result
The file comparison command will output multiple byte mismatches between the two hashes:
```
Comparing files original_hash.txt and MODIFIED_HASH.TXT
00000019: 39 64
0000001A: 33 31
... (extensive differences) ...
```
This confirms that tampering was immediately detected.

---

## 4. Key Parameters Breakdown
| Command / Parameter | Purpose |
| :--- | :--- |
| `dgst` | OpenSSL message digest engine. |
| `-sha256` | Specifies the SHA-256 hashing algorithm (256-bit output). |
| `original.txt` | Target file whose digest is calculated. |
| `> original_hash.txt` | Shell redirection to store the resulting hash into a text file. |

---

## 5. Viva / Oral Questions & Answers
- **Q1: What is the main difference between encryption and hashing?**  
  *Answer:* Encryption is a two-way function designed for confidentiality (can be reversed using a key). Hashing is a one-way function designed for integrity verification (cannot be reversed).
- **Q2: What is the Avalanche Effect?**  
  *Answer:* It is a desirable property of cryptographic hash functions where a minimal change in the input (such as altering 1 character or bit) causes a massive, unpredictable change across the entire digest.
- **Q3: Can two different files ever produce the exact same SHA-256 hash?**  
  *Answer:* Mathematically, because input space is infinite and output space is fixed ($2^{256}$ possibilities), collisions theoretically exist. However, $2^{256}$ is roughly $1.15 \times 10^{77}$ combinations—larger than the estimated number of atoms in the observable universe. Finding a collision would require billions of years of computation with modern supercomputers.
