require('dotenv').config()

const axios = require('axios')
const crypto = require('crypto')
const fs = require('fs').promises
const jose = require('jose')

const { selfDescription } = require('./self-description.json')
const currentTime = new Date().getTime()
const BASE_URL = "https://compliance.gaia-x.eu"

async function canonize(selfDescription) {
  const URL = BASE_URL + '/api/v1/normalize'
  const { data } = await axios.post(URL, { selfDescription })

  return data
}

function sha256(input) {
  return crypto.createHash('sha256').update(input).digest('hex')
}

async function sign(hash) {
  const algorithm = 'PS256'
  const rsaPrivateKey = await jose.importPKCS8(process.env.PRIVATE_KEY, algorithm)

  const jws = await new jose.CompactSign(new TextEncoder().encode(hash))
    .setProtectedHeader({ alg: 'PS256', b64: false, crit: ['b64'] })
    .sign(rsaPrivateKey)

  return jws
}

async function createProof(hash) {
  const proof = {
    type: 'JsonWebKey2020',
    created: new Date(currentTime).toISOString(),
    proofPurpose: 'assertionMethod',
    verificationMethod: process.env.VERIFICATION_METHOD ?? 'did:web:compliance.lab.gaia-x.eu',
    jws: await sign(hash)
  }

  return proof
}

async function verify(jws) {
  const algorithm = 'PS256'
  const x509 = await jose.importX509(process.env.PUBLIC_KEY, algorithm)
  const publicKeyJwk = await jose.exportJWK(x509)

  const pubkey = await jose.importJWK(publicKeyJwk, 'PS256')

  try {
    const result = await jose.compactVerify(jws, pubkey)

    return { protectedHeader: result.protectedHeader, content: new TextDecoder().decode(result.payload) }
  } catch (error) {
    return {}
  }
}

async function createSignedSdFile(selfDescription, proof) {
  const content = proof ? { selfDescription, proof } : selfDescription
  const status = proof ? "self-signed" : "complete"
  const type = proof ? selfDescription['@type'].split(':')[0] : selfDescription.selfDescriptionCredential.selfDescription['@type'].split(':')[0]
  const data = JSON.stringify(content, null, 2)
  const filename = `${currentTime}_${status}_${type}.json`

  await fs.writeFile(filename, data)

  return filename
}

async function createDIDFile() {
  const algorithm = 'PS256'
  const x509 = await jose.importX509(process.env.PUBLIC_KEY, algorithm)
  const publicKeyJwk = await jose.exportJWK(x509)
  publicKeyJwk.alg = algorithm

  const did = {
    "@context": ["https://www.w3.org/ns/did/v1"],
    "id": process.env.VERIFICATION_METHOD,
    "verificationMethod": [
      {
        "@context": "https://w3c-ccg.github.io/lds-jws2020/contexts/v1/",
        "id": process.env.VERIFICATION_METHOD + "#JWK2020-RSA",
        publicKeyJwk,
        "x5u": process.env.X5U_URL
      }
    ],
    "assertionMethod": [process.env.VERIFICATION_METHOD + "#JWK2020-RSA",]
  }

  const data = JSON.stringify(did, null, 2)
  const filename = `${currentTime}_did.json`

  await fs.writeFile(filename, data)

  return filename
}

function logger(...msg) {
  console.log(msg.join(" "))
}

async function signSd(selfDescription, proof) {
  const URL = BASE_URL + "/api/v1/sign"
  const { data } = await axios.post(URL, { selfDescription, proof })

  return data
}

async function verifySelfDescription(selfDescription) {
  const URL = BASE_URL + "/api/v1/participant/verify/raw"
  try {
    const { data } = await axios.post(URL, selfDescription)

    return data
  } catch (error) {
    return {}
  }
}

async function main() {
  const canonizedSD = await canonize(selfDescription)

  const hash = sha256(canonizedSD)
  logger(`📈 Hashed canonized SD ${hash}`)

  const proof = await createProof(hash)
  logger(proof ? '🔒 SD signed successfully (local)' : '❌ SD signing failed (local)')

  const verificationResult = await verify(proof.jws.replace('..', `.${hash}.`))
  logger(verificationResult?.content === hash ? '✅ Verification successful (local)' : '❌ Verification failed (local)')

  const filenameSignedSd = await createSignedSdFile(selfDescription, proof)
  logger(`📁 ${filenameSignedSd} saved`)

  const filenameDid = await createDIDFile()
  logger(`📁 ${filenameDid} saved`, "\n")

  const complianceCredential = await signSd(selfDescription, proof)
  logger(complianceCredential ? '🔒 SD signed successfully (compliance service)' : '❌ SD signing failed (compliance service)')

  if (complianceCredential) {
    const completeSd = { selfDescriptionCredential: { selfDescription, proof }, complianceCredential: complianceCredential.complianceCredential }

    const verificationResultRemote = await verifySelfDescription(completeSd)
    logger(verificationResultRemote?.conforms === true ? '✅ Verification successful (compliance service)' : '❌ Verification failed (compliance service)')

    const filenameCompleteSd = await createSignedSdFile(completeSd)
    logger(`📁 ${filenameCompleteSd} saved`)
  }
}

main()
