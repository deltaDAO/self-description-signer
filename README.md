## How To Use

1. Update your self description in `self-description.json`.
2. Create a new `.env` file with `privateKey`, `publicKey` and `verificationMethod` as properties. 
3. Install dependencies `npm i` and execute the script `node index.js` (node@16 or higher required)
4. The given self description will be signed and a new file containing self description + proof called `type-unixtimestamp.json` will be created.