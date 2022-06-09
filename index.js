const crypto = require('crypto')
const jose = require('jose')
const dotenv = require('dotenv')
const { selfDescription } = require('./self-description.json')
const axios = require('axios')
const fs = require('fs')

require('dotenv').config()

async function verify(jws) {
  const algorithm = 'PS256'
  const ecPublicKey = await jose.importX509(process.env.publicKey, algorithm)
  try {
    const result = await jose.compactVerify(jws, ecPublicKey)

    return { protectedHeader: result.protectedHeader, content: new TextDecoder().decode(result.payload) }
  } catch (error) {
    return {}
  }
}

async function sign(hash) {
  const algorithm = 'PS256'
  const rsaPrivateKey = await jose.importPKCS8(process.env.privateKey, algorithm)

  const jws = await new jose.CompactSign(new TextEncoder().encode(hash))
    .setProtectedHeader({ alg: 'PS256', b64: false, crit: ['b64'] })
    .sign(rsaPrivateKey)

  return jws
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

async function canonize(selfDescription) {
  const url = 'https://compliance.lab.gaia-x.eu/api/v1/participant/normalize'
  const json = JSON.stringify({ selfDescription });
  return axios.post(url, { selfDescription })
    .then(res => res.data)
    .catch(err => console.error(err))
}

function createProof(jws) {
  const proof = {
    type: "RsaSignature2018",
    created: new Date().toISOString(),
    proofPurpose: "assertionMethod",
    jws
  }

  return proof
}

function saveResult(selfDescription, proof) {
  const content = { selfDescriptionCredential: { selfDescription, proof } }
  const data = JSON.stringify(content, null, 2);
  const filename = "sd-" + new Date().getTime() + ".json"

  fs.writeFile(filename, data, (err) => {
    if (err) throw err;
    console.log("📁", filename, "saved ")
  });
  
}

async function main() {
  const canonizedSD = await canonize(selfDescription)
  const hash = sha256(canonizedSD)
  console.log("📈 hash", hash)

  const jws = await sign(hash)
  const proof = createProof(jws)
  
  console.log("🔒 Proof created")
  const verificationResult = await verify(jws.replace('..', `.${hash}.`))
  console.log(verificationResult.content === hash ? "✅ Verification successful" : "❌ Verification failed")

  saveResult(selfDescription, proof)
}

main()