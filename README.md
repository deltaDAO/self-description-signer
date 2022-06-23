<h1 align="center"> Self-Description-Signer</h1>

- [How To Use](#how-to-use)
- [How it Works](#how-it-works)
## How To Use

1. Update the self description in `self-description.json`, replace it with your own. See details in the [Architecture Document](https://gaia-x.gitlab.io/policy-rules-committee/trust-framework/participant/)
2. Create a new `.env` file with `PRIVATE_KEY`, `CERTIFICATE`, `VERIFICATION_METHOD` and `X5U_URL` as properties. Feel free to use the example file `example.env`.
3. Install dependencies `npm i` and execute the script `node index.js` (node@16 or higher required).
    - Alternatively, the script can be run with docker
       1. Build the container with `docker build -t self-description-signer .`
       2. Run the script with `docker run -it --mount src="$(pwd)/config",target=/usr/src/app/config,type=bind self-description-signer`
4. The given self description will be locally signed and a new file containing self description + proof called `{timestamp}_self-signed_{gx-type}.json` will be created.

   **Example self-signed Self Description:**

   ```json
   {
     "selfDescription": {
       "@context": {
         "sh": "http://www.w3.org/ns/shacl#",
         "xsd": "http://www.w3.org/2001/XMLSchema#",
         "gx-participant": "http://w3id.org/gaia-x/participant#"
       },
       "@id": "http://example.org/participant-dp6gtq7i75lmk9p4j2tfg",
       "@type": "gx-participant:LegalPerson",
       "gx-participant:registrationNumber": {
         "@type": "xsd:string",
         "@value": "DEANY1234NUMBER"
       },
       "gx-participant:legalAddress": {
         "@type": "gx-participant:Address",
         "gx-participant:country": {
           "@type": "xsd:string",
           "@value": "DEU"
         }
       },
       "gx-participant:headquarterAddress": {
         "@type": "gx-participant:Address",
         "gx-participant:country": {
           "@type": "xsd:string",
           "@value": "DEU"
         }
       }
     },
     "proof": {
       "type": "JsonWebKey2020",
       "created": "2022-06-15T13:16:47.806Z",
       "proofPurpose": "assertionMethod",
       "verificationMethod": "did:web:compliance.lab.gaia-x.eu",
       "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..dPRENHOwcUHMjniVUvP-1MrLe6CyfBGWzel4LYBQLh2CgokvBvb7Q8yO3yR1m41X55YjgNKF7eYKClrMVwsPzmCVA4-QVKdpVxGVL4rsm2IhqKMGMEk22RW8sK5SSvUSY6Rg43y9MkNdDdcEpvxGXgryynLZpMVdtYM2XrJwxm4gn0YpKlNDT8Som25XnU0UieLzftJu7ktPnUB-K6yPpgyLBcKb9pSsS_8bjtwBQ_eoQ7ohDeZGVcXe59AoLlysIy96oy7oItbWjaZwVZMI0Qk4CyKiMmG1DSJVSpifot4zf4CEumRuNnGGi4Lj4rvai6kU-xwJiQbf5j25KUYM2g"
     }
   }
   ```

5. In addition, a `did.json` will be created based on the provided `CERTIFICATE` and `VERIFICATION_METHOD`

    **Example `did.json`:**

    ```json
    {
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": "did:web:compliance.lab.gaia-x.eu",
    "verificationMethod": [
        {
        "@context": "https://w3c-ccg.github.io/lds-jws2020/contexts/v1/",
        "id": "did:web:compliance.lab.gaia-x.eu#JWK2020-RSA",
        "publicKeyJwk": {
            "kty": "RSA",
            "n": "ulmXEa0nehbR338h6QaWLjMqfXE7mKA9PXoC_6_8d26xKQuBKAXa5k0uHhzQfNlAlxO-IpCDgf9cVzxIP-tkkefsjrXc8uvkdKNK6TY9kUxgUnOviiOLpHe88FB5dMTH6KUUGkjiPfq3P0F9fXHDEoQkGSpWui7eD897qSEdXFre_086ns3I8hSVCxoxlW9guXa_sRISIawCKT4UA3ZUKYyjtu0xRy7mRxNFh2wH0iSTQfqf4DWUUThX3S-jeRCRxqOGQdQlZoHym2pynJ1IYiiIOMO9L2IQrQl35kx94LGHiF8r8CRpLrgYXTVd9U17-nglrUmJmryECxW-555ppQ",
            "e": "AQAB",
            "alg": "PS256"
        },
        "x5u": "https://compliance.gaia-x.eu/.well-known/x509CertificateChain.pem"
        }
    ],
    "assertionMethod": ["did:web:compliance.lab.gaia-x.eu#JWK2020-RSA"]
    }
    ```

6. Upload this did.json to your domain (e.g. `https://your_domain.com/.well-known/did.json`).


7. After uploading the did.json(important) re-run the script and finally, the compliance service compliance service is used to sign the locally signed self description. It signs it if the final result is successfully verified against the compliance service. The result is stored in a new file called `{timestamp}_complete_{gx-type}.json`


    **Complete Self-Description signed by the Compliance Service:**

    ```json
    {
    "selfDescriptionCredential": {
        "selfDescription": {
        "@context": {
            "sh": "http://www.w3.org/ns/shacl#",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "gx-participant": "http://w3id.org/gaia-x/participant#"
        },
        "@id": "http://example.org/participant-dp6gtq7i75lmk9p4j2tfg",
        "@type": "gx-participant:LegalPerson",
        "gx-participant:registrationNumber": {
            "@type": "xsd:string",
            "@value": "DEANY1234NUMBER"
        },
        "gx-participant:legalAddress": {
            "@type": "gx-participant:Address",
            "gx-participant:country": {
            "@type": "xsd:string",
            "@value": "DEU"
            }
        },
        "gx-participant:headquarterAddress": {
            "@type": "gx-participant:Address",
            "gx-participant:country": {
            "@type": "xsd:string",
            "@value": "DEU"
            }
        }
        },
        "proof": {
        "type": "JsonWebKey2020",
        "created": "2022-06-15T13:16:47.806Z",
        "proofPurpose": "assertionMethod",
        "verificationMethod": "did:web:compliance.lab.gaia-x.eu",
        "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..dPRENHOwcUHMjniVUvP-1MrLe6CyfBGWzel4LYBQLh2CgokvBvb7Q8yO3yR1m41X55YjgNKF7eYKClrMVwsPzmCVA4-QVKdpVxGVL4rsm2IhqKMGMEk22RW8sK5SSvUSY6Rg43y9MkNdDdcEpvxGXgryynLZpMVdtYM2XrJwxm4gn0YpKlNDT8Som25XnU0UieLzftJu7ktPnUB-K6yPpgyLBcKb9pSsS_8bjtwBQ_eoQ7ohDeZGVcXe59AoLlysIy96oy7oItbWjaZwVZMI0Qk4CyKiMmG1DSJVSpifot4zf4CEumRuNnGGi4Lj4rvai6kU-xwJiQbf5j25KUYM2g"
        }
    },
    "complianceCredential": {
        "@context": ["https://www.w3.org/2018/credentials/v1"],
        "@type": ["VerifiableCredential", "ParticipantCredential"],
        "id": "https://catalogue.gaia-x.eu/credentials/ParticipantCredential/1655299009984",
        "issuer": "did:web:compliance.lab.gaia-x.eu",
        "issuanceDate": "2022-06-15T13:16:49.984Z",
        "credentialSubject": {
        "id": "http://example.org/participant-dp6gtq7i75lmk9p4j2tfg",
        "hash": "42658394dbbedfc2e5ab472a2ab8cd0f8f7ce8a0d3d6fd9fc5f067937d2883c3"
        },
        "proof": {
        "type": "JsonWebKey2020",
        "created": "2022-06-15T13:16:49.984Z",
        "proofPurpose": "assertionMethod",
        "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..fmJskI4pv-QCtHDgyW9H9EWXtGdDm-QHeCsN4YgOZgX7ADQgSHJd2ya7w7PgXbd6t6ZXEKdYluTUQul6l7w__MTrduVnn0aGKgR7Xx_A-0RHZDP9aV1r1nYOho3XJk53hPhzGMNLW6kswy3FuKEnm1avAj4FdpZPgbSaCA7J5XwTIFWFQmOON3hpw8qjLrICVOS803KMQXBohe_XBEPFe8Zb0dYZ8fveHA0QrSRmiLQ_rRUXxxMbc81cXiI7IBgRKCNOPhmj1O6Xm-iL2KV-2pwtYEZA-GLQ5jjeX7Sh3_QVQ8fPgtfpMiVs_PxjGcjA0Z7Zsbj7-xX8dVzWj7b9jg",
        "verificationMethod": "did:web:compliance.lab.gaia-x.eu"
        }
    }
    }
    ```

## How it Works

1. The given Self Description is canonized with [URDNA2015](https://json-ld.github.io/rdf-dataset-canonicalization/spec/)
2. Next the canonized output is hashed with [SHA256](https://json-ld.github.io/rdf-dataset-canonicalization/spec/#dfn-hash-algorithm).
3. That hash is then signed with the given private key and the proof is created using [JsonWebKey2020](https://w3c-ccg.github.io/lds-jws2020/#json-web-signature-2020).
