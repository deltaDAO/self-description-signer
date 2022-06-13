require('dotenv').config()

const axios = require('axios')
const crypto = require('crypto')
const fs = require('fs').promises
const jose = require('jose')

const { selfDescription } = require('./self-description.json')

async function canonize(selfDescription) {
  const url = 'https://compliance.lab.gaia-x.eu/api/v1/normalize'
  const { data } = await axios.post(url, { selfDescription })

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
    created: new Date().toISOString(),
    proofPurpose: 'assertionMethod',
    verificationMethod: process.env.VERIFICATION_METHOD ?? 'did:web:compliance.lab.gaia-x.eu',
    jws: await sign(hash)
  }

  return proof
}

async function verify(jws) {
  const algorithm = 'PS256'
  const x509 = await jose.importX509(process.env.PUBLIC_KEY, algorithm)
  try {
    const result = await jose.compactVerify(jws, x509)

    return { protectedHeader: result.protectedHeader, content: new TextDecoder().decode(result.payload) }
  } catch (error) {
    return {}
  }
}

async function saveResultToFile(selfDescription, proof) {
  const content = { selfDescription, proof }
  const data = JSON.stringify(content, null, 2)
  const filename = `${selfDescription['@type'].split(':')[0]}-${new Date().getTime()}.json`

  await fs.writeFile(filename, data)

  return filename
}

function logger(...msg) {
  console.log(msg.join(" "))
}

async function main() {
  const canonizedSD = await canonize(selfDescription)
  
  const hash = sha256(canonizedSD)
  logger(`📈 Hashed canonized SD ${hash}`)

  const proof = await createProof(hash)
  logger(`🔒 Proof created (${process.env.VERIFICATION_METHOD ?? 'did:web:compliance.lab.gaia-x.eu'})`)

  const verificationResult = await verify(proof.jws.replace('..', `.${hash}.`))
  logger(verificationResult?.content === hash ? '✅ Verification successful' : '❌ Verification failed')

  const filename = await saveResultToFile(selfDescription, proof)
  logger(`📁 ${filename} saved`)
}

main()
