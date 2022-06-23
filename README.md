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
     "@context": [
       "http://www.w3.org/ns/shacl#",
       "http://www.w3.org/2001/XMLSchema#",
       "http://w3id.org/gaia-x/participant#",
       "@nest"
     ],
     "@id": "https://delta-dao.com/.well-known/participant.json",
     "@type": ["VerifiableCredential", "LegalPerson"],
     "credentialSubject": {
       "id": "did:web:delta-dao.com",
       "gx-participant:name": {
         "@value": "deltaDAO AG",
         "@type": "xsd:string"
       },
       "gx-participant:legalName": {
         "@value": "deltaDAO AG",
         "@type": "xsd:string"
       },
       "gx-participant:registrationNumber": {
         "@value": "DEK1101R.HRB170364",
         "@type": "xsd:string"
       },
       "gx-participant:leiCode": {
         "@value": "391200FJBNU0YW987L26",
         "@type": "xsd:string"
       },
       "gx-participant:ethereumAddress": {
         "@value": "0x4C84a36fCDb7Bc750294A7f3B5ad5CA8F74C4A52",
         "@type": "xsd:string"
       },
       "gx-participant:headquarterAddress": {
         "@type": "gx-participant:Address",
         "gx-participant:country": {
           "@value": "DE",
           "@type": "xsd:string"
         },
         "gx-participant:street-address": {
           "@value": "Geibelstraße 46b",
           "@type": "xsd:string"
         },
         "gx-participant:postal-code": {
           "@value": "22303",
           "@type": "xsd:string"
         },
         "gx-participant:locality": {
           "@value": "Hamburg",
           "@type": "xsd:string"
         }
       },
       "gx-participant:legalAddress": {
         "@type": "gx-participant:Address",
         "gx-participant:country": {
           "@value": "DE",
           "@type": "xsd:string"
         },
         "gx-participant:street-address": {
           "@value": "Geibelstraße 46b",
           "@type": "xsd:string"
         },
         "gx-participant:postal-code": {
           "@value": "22303",
           "@type": "xsd:string"
         },
         "gx-participant:locality": {
           "@value": "Hamburg",
           "@type": "xsd:string"
         }
       }
     },
     "proof": {
       "type": "JsonWebKey2020",
       "created": "2022-06-23T15:34:47.005Z",
       "proofPurpose": "assertionMethod",
       "verificationMethod": "did:web:compliance.lab.gaia-x.eu",
       "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..mKv6H0MfTjOcw7PTrRUfxP3JF4ZYFy4lwOqZHO1OHRsGFDeVUCUEu4eT-8PxI8sF3Kt3i9pZyKqbyabVUkUgwVrR_RYHOnrdwyxVjBpUYTFG7Q-IJwQbqes5r38DhUUF4FDMMRyXfRsPq7ARLAxK74nMOOCmDtPyggYUua-e5uO7t4Sdv1pGDjymfjSNovQpnvGMnPEzLfRqYCnC98dPYT6Ib9H1PJHLFrP1sYvXQ1eJzfRIR8GU3cYz2O9BxQXkA7zuodoUmqxTsQ-uMDoY66yc4okA92erLwuRxqZp1vT5MJD1_2cCmeZlmGn3agooLhL1CWwpQGIRhcrk6fFqhA"
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
         "id": "did:web:compliance.lab.gaia-x.eu",
         "type": "JsonWebKey2020",
         "controller": "did:web:compliance.gaia-x.eu#JWK2020-RSA",
         "publicKeyJwk": {
           "kty": "RSA",
           "n": "ulmXEa0nehbR338h6QaWLjMqfXE7mKA9PXoC_6_8d26xKQuBKAXa5k0uHhzQfNlAlxO-IpCDgf9cVzxIP-tkkefsjrXc8uvkdKNK6TY9kUxgUnOviiOLpHe88FB5dMTH6KUUGkjiPfq3P0F9fXHDEoQkGSpWui7eD897qSEdXFre_086ns3I8hSVCxoxlW9guXa_sRISIawCKT4UA3ZUKYyjtu0xRy7mRxNFh2wH0iSTQfqf4DWUUThX3S-jeRCRxqOGQdQlZoHym2pynJ1IYiiIOMO9L2IQrQl35kx94LGHiF8r8CRpLrgYXTVd9U17-nglrUmJmryECxW-555ppQ",
           "e": "AQAB",
           "alg": "PS256",
           "x5u": "https://compliance.gaia-x.eu/.well-known/x509CertificateChain.pem"
         }
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
       "@context": [
         "http://www.w3.org/ns/shacl#",
         "http://www.w3.org/2001/XMLSchema#",
         "http://w3id.org/gaia-x/participant#",
         "@nest"
       ],
       "@id": "https://delta-dao.com/.well-known/participant.json",
       "@type": ["VerifiableCredential", "LegalPerson"],
       "credentialSubject": {
         "id": "did:web:delta-dao.com",
         "gx-participant:name": {
           "@value": "deltaDAO AG",
           "@type": "xsd:string"
         },
         "gx-participant:legalName": {
           "@value": "deltaDAO AG",
           "@type": "xsd:string"
         },
         "gx-participant:registrationNumber": {
           "@value": "DEK1101R.HRB170364",
           "@type": "xsd:string"
         },
         "gx-participant:leiCode": {
           "@value": "391200FJBNU0YW987L26",
           "@type": "xsd:string"
         },
         "gx-participant:ethereumAddress": {
           "@value": "0x4C84a36fCDb7Bc750294A7f3B5ad5CA8F74C4A52",
           "@type": "xsd:string"
         },
         "gx-participant:headquarterAddress": {
           "@type": "gx-participant:Address",
           "gx-participant:country": {
             "@value": "DE",
             "@type": "xsd:string"
           },
           "gx-participant:street-address": {
             "@value": "Geibelstraße 46b",
             "@type": "xsd:string"
           },
           "gx-participant:postal-code": {
             "@value": "22303",
             "@type": "xsd:string"
           },
           "gx-participant:locality": {
             "@value": "Hamburg",
             "@type": "xsd:string"
           }
         },
         "gx-participant:legalAddress": {
           "@type": "gx-participant:Address",
           "gx-participant:country": {
             "@value": "DE",
             "@type": "xsd:string"
           },
           "gx-participant:street-address": {
             "@value": "Geibelstraße 46b",
             "@type": "xsd:string"
           },
           "gx-participant:postal-code": {
             "@value": "22303",
             "@type": "xsd:string"
           },
           "gx-participant:locality": {
             "@value": "Hamburg",
             "@type": "xsd:string"
           }
         }
       },
       "proof": {
         "type": "JsonWebKey2020",
         "created": "2022-06-23T15:34:47.005Z",
         "proofPurpose": "assertionMethod",
         "verificationMethod": "did:web:compliance.lab.gaia-x.eu",
         "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..mKv6H0MfTjOcw7PTrRUfxP3JF4ZYFy4lwOqZHO1OHRsGFDeVUCUEu4eT-8PxI8sF3Kt3i9pZyKqbyabVUkUgwVrR_RYHOnrdwyxVjBpUYTFG7Q-IJwQbqes5r38DhUUF4FDMMRyXfRsPq7ARLAxK74nMOOCmDtPyggYUua-e5uO7t4Sdv1pGDjymfjSNovQpnvGMnPEzLfRqYCnC98dPYT6Ib9H1PJHLFrP1sYvXQ1eJzfRIR8GU3cYz2O9BxQXkA7zuodoUmqxTsQ-uMDoY66yc4okA92erLwuRxqZp1vT5MJD1_2cCmeZlmGn3agooLhL1CWwpQGIRhcrk6fFqhA"
       }
     },
     "complianceCredential": {
       "@context": ["https://www.w3.org/2018/credentials/v1"],
       "@type": ["VerifiableCredential", "ParticipantCredential"],
       "id": "https://catalogue.gaia-x.eu/credentials/ParticipantCredential/1655998489222",
       "issuer": "did:web:compliance.gaia-x.eu",
       "issuanceDate": "2022-06-23T15:34:49.222Z",
       "credentialSubject": {
         "id": "did:web:delta-dao.com",
         "hash": "2ba93a377cebabd7329d002be01e93a4c4787bfd84457d81787e830196bf89af"
       },
       "proof": {
         "type": "JsonWebKey2020",
         "created": "2022-06-23T15:34:49.222Z",
         "proofPurpose": "assertionMethod",
         "jws": "eyJhbGciOiJQUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..o7E2kAUoHFVDAPF5vp6nigQBx9SIJ51L4RAuRyaRo91J-ofl5HpGykTYDYWypitmdYaDtASxf45PH_9S59rwFM4CBVMtf8aFjtfyzHZxORP2tKp6m6U1LKIbU9v6hphJO4_PAUQGLJwomFY0IpMKEBgKERouXuI5wJxKy9JNv6IcyGqtVrDqRjXEhCPAWA--ndGnCWABmLNfzCW6rvwh1_UX42yAOpCGSyQPFR1Qlc6qokx_AXrko1npFcrXN3KUUJ0dXqMI8LDTGGdZgnvFAtCAAkJLauAsOvbJO6Rj06FayvBdRRFSTT01x3-qIB5adVrtXQzID_Snmr59u6jgZA",
         "verificationMethod": "did:web:compliance.gaia-x.eu"
       }
     }
   }
   ```

## How it Works

1. The given Self Description is canonized with [URDNA2015](https://json-ld.github.io/rdf-dataset-canonicalization/spec/)
2. Next the canonized output is hashed with [SHA256](https://json-ld.github.io/rdf-dataset-canonicalization/spec/#dfn-hash-algorithm).
3. That hash is then signed with the given private key and the proof is created using [JsonWebKey2020](https://w3c-ccg.github.io/lds-jws2020/#json-web-signature-2020).
