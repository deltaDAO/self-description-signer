## How To Use

1. Update your self description in `self-description.json`.
2. Create a new `.env` file with `PRIVATE_KEY`, `PUBLIC_KEY` and `VERIFICATION_METHOD` as properties. 
3. Install dependencies `npm i` and execute the script `node index.js` (node@16 or higher required).
4. The given self description will be signed and a new file containing self description + proof called `type-unixtimestamp.json` will be created.

## How it Works
1. The given Self Description is canonized with [URDNA2015](https://json-ld.github.io/rdf-dataset-canonicalization/spec/)
2. Next the canonized output is hashed with [SHA256](https://json-ld.github.io/rdf-dataset-canonicalization/spec/#dfn-hash-algorithm).
3. That hash is then signed with the given private key and a  proof is created using [JsonWebKey2020](https://w3c-ccg.github.io/lds-jws2020/#json-web-signature-2020).
