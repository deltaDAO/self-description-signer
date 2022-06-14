## How To Use

1. Update the self description in `self-description.json`.
2. Create a new `.env` file with `PRIVATE_KEY`, `PUBLIC_KEY`, `VERIFICATION_METHOD` and `X5U_URL` as properties. 
3. Install dependencies `npm i` and execute the script `node index.js` (node@16 or higher required).
4. The given self description will be locally signed and a new file containing self description + proof called `timestamp_self-signed_gx-type.json` will be created.
5. In addition, a did.json will be created based on the provided `PUBLIC_KEY` and `VERIFICATION_METHOD`
6. Upload this did.json to your domain (e.g. `https://your_domain.com/.well-known/did.json`).
7. Re-run the script and finally, the compliance service is used to sign the locally signed self description. It signs it if the final result is against the compliance service. The result is stored in a new file called `timestamp_complete_gx-type.json`

## How it Works
1. The given Self Description is canonized with [URDNA2015](https://json-ld.github.io/rdf-dataset-canonicalization/spec/)
2. Next the canonized output is hashed with [SHA256](https://json-ld.github.io/rdf-dataset-canonicalization/spec/#dfn-hash-algorithm).
3. That hash is then signed with the given private key and the proof is created using [JsonWebKey2020](https://w3c-ccg.github.io/lds-jws2020/#json-web-signature-2020).
