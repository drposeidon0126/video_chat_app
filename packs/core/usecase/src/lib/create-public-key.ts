import { Identity } from '@peek/core/model'
import { base64url } from '@peek/util/format'

export class CreatePublicKey {
  async attestation(user: Identity, challenge: string): Promise<Credential> {
    return await navigator.credentials.create({
      publicKey: {
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
        },
        challenge: base64url.decode(challenge),
        rp: { id: document.domain, name: 'My Acme Inc' },
        user: {
          id: base64url.decode(user.code),
          name: user.name,
          displayName: user.nick,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },
          { type: 'public-key', alg: -257 },
        ],
      },
    })
    navigator.credentials.preventSilentAccess()
  }
}

export function publicKeyCredentialToJSON(
  pubKeyCred: ArrayBuffer | Array<ArrayBuffer> | object
) {
  if (pubKeyCred instanceof ArrayBuffer) {
    return base64url.encode(pubKeyCred)
  } else if (pubKeyCred instanceof Array) {
    return pubKeyCred.map(publicKeyCredentialToJSON)
  } else if (pubKeyCred instanceof Object) {
    const obj = {}
    for (let key in pubKeyCred) {
      obj[key] = publicKeyCredentialToJSON(pubKeyCred[key])
    }
    return obj
  } else return pubKeyCred
}


let subtleCrypto = window.crypto.subtle;

// subtleCrypto.decrypt(...);
// subtleCrypto.deriveBits(...);
// subtleCrypto.deriveKey(...);
// subtleCrypto.digest(...);
// subtleCrypto.encrypt(...);
// subtleCrypto.exportKey(...);
// subtleCrypto.generateKey(...);
// subtleCrypto.importKey(...);
// subtleCrypto.sign(...);
// subtleCrypto.unwrapKey(...);
// subtleCrypto.verify(...);
// subtleCrypto.wrapKey(...);

function digestArrayBuffer(data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', data);
}

async function digestString(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message); // Uint8Array UTF-8

  const digestBuffer = await crypto.subtle.digest('SHA-256', data);

  const decoder = new TextDecoder(); // default 'utf-8'
  return decoder.decode(digestBuffer);
}
