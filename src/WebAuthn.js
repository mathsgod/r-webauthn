export default class WebAuthn {
    constructor() {

    }

    register(key) {
        key = JSON.parse(key);
        var p = new Promise((resolve, reject) => {
            if (!('credentials' in navigator)) {
                reject("You broswer does not support webauthentication.");
                return;
            }

            key.publicKey.challenge = new Uint8Array(key.publicKey.challenge); // convert type for use by key
            key.publicKey.user.id = new Uint8Array(key.publicKey.user.id);

            navigator.credentials.create({ publicKey: key.publicKey }).then(function (aNewCredentialInfo) {
                // console.log("Credentials.Create response: ", aNewCredentialInfo);
                var cd = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(aNewCredentialInfo.response.clientDataJSON)));
                /*if (key.b64challenge != cd.challenge) {
                    reject({
                        message: 'key returned something unexpected (1)'
                    });
                    return;
                }*/
                if ('https://' + key.publicKey.rp.name != cd.origin) { return cb(false, 'key returned something unexpected (2)'); }
                if (!('type' in cd)) { return cb(false, 'key returned something unexpected (3)'); }
                if (cd.type != 'webauthn.create') {
                    reject({
                        message: 'key returned something unexpected (4)'
                    });
                    return;
                }

                var ao = [];
                (new Uint8Array(aNewCredentialInfo.response.attestationObject)).forEach(function (v) { ao.push(v); });
                var rawId = [];
                (new Uint8Array(aNewCredentialInfo.rawId)).forEach(function (v) { rawId.push(v); });
                var info = {
                    rawId: rawId,
                    id: aNewCredentialInfo.id,
                    type: aNewCredentialInfo.type,
                    response: {
                        attestationObject: ao,
                        clientDataJSON:
                            JSON.parse(String.fromCharCode.apply(null, new Uint8Array(aNewCredentialInfo.response.clientDataJSON)))
                    }
                };
                resolve(info);
            }).catch(function (aErr) {
                if (("name" in aErr) && (aErr.name == "AbortError" || aErr.name == "NS_ERROR_ABORT") ||
                    aErr.name == 'NotAllowedError') {
                    reject({
                        message: 'abort'
                    });
                } else {
                    reject({
                        message: aErr.toString()
                    });
                }
            });

        });


        return p;

    }

    authenticate(key) {
        var pk = JSON.parse(key);
        var p = new Promise((resolve, reject) => {

            if (!('credentials' in navigator)) {
                reject("You broswer does not support webauthentication.");
                return;
            }


            var originalChallenge = pk.challenge;
            pk.challenge = new Uint8Array(pk.challenge);
            pk.allowCredentials.forEach(function (k, idx) {
                pk.allowCredentials[idx].id = new Uint8Array(k.id);
            });
            /* ask the browser to prompt the user */
            navigator.credentials.get({ publicKey: pk }).then(function (aAssertion) {
                // console.log("Credentials.Get response: ", aAssertion);
                var ida = [];
                (new Uint8Array(aAssertion.rawId)).forEach(function (v) { ida.push(v); });
                var cd = JSON.parse(String.fromCharCode.apply(null,
                    new Uint8Array(aAssertion.response.clientDataJSON)));
                var cda = [];
                (new Uint8Array(aAssertion.response.clientDataJSON)).forEach(function (v) { cda.push(v); });
                var ad = [];
                (new Uint8Array(aAssertion.response.authenticatorData)).forEach(function (v) { ad.push(v); });
                var sig = [];
                (new Uint8Array(aAssertion.response.signature)).forEach(function (v) { sig.push(v); });
                var info = {
                    type: aAssertion.type,
                    originalChallenge: originalChallenge,
                    rawId: ida,
                    response: {
                        authenticatorData: ad,
                        clientData: cd,
                        clientDataJSONarray: cda,
                        signature: sig
                    }
                };
                resolve(info);
            }).catch(function (aErr) {
                if (("name" in aErr) && (aErr.name == "AbortError" || aErr.name == "NS_ERROR_ABORT" ||
                    aErr.name == "NotAllowedError")) {
                    reject({
                        message: "abort"
                    });
                } else {
                    reject({
                        message: aErr.toString()
                    });
                }
            });
        });
        return p;

    }

}