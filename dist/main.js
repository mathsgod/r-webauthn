!function(e){var r={};function n(t){if(r[t])return r[t].exports;var a=r[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,n),a.l=!0,a.exports}n.m=e,n.c=r,n.d=function(e,r,t){n.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,r){if(1&r&&(e=n(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(n.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var a in e)n.d(t,a,function(r){return e[r]}.bind(null,a));return t},n.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(r,"a",r),r},n.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},n.p="",n(n.s=0)}([function(e,r,n){"use strict";n.r(r);window.WebAuthn=class{constructor(){}register(e){return e=JSON.parse(e),new Promise((r,n)=>{"credentials"in navigator?(e.publicKey.challenge=new Uint8Array(e.publicKey.challenge),e.publicKey.user.id=new Uint8Array(e.publicKey.user.id),navigator.credentials.create({publicKey:e.publicKey}).then(function(t){var a=JSON.parse(String.fromCharCode.apply(null,new Uint8Array(t.response.clientDataJSON)));if("https://"+e.publicKey.rp.name!=a.origin)return cb(!1,"key returned something unexpected (2)");if(!("type"in a))return cb(!1,"key returned something unexpected (3)");if("webauthn.create"==a.type){var i=[];new Uint8Array(t.response.attestationObject).forEach(function(e){i.push(e)});var o=[];new Uint8Array(t.rawId).forEach(function(e){o.push(e)});var u={rawId:o,id:t.id,type:t.type,response:{attestationObject:i,clientDataJSON:JSON.parse(String.fromCharCode.apply(null,new Uint8Array(t.response.clientDataJSON)))}};r(u)}else n({message:"key returned something unexpected (4)"})}).catch(function(e){"name"in e&&("AbortError"==e.name||"NS_ERROR_ABORT"==e.name)||"NotAllowedError"==e.name?n({message:"abort"}):n({message:e.toString()})})):n("You broswer does not support webauthentication.")})}authenticate(e){var r=JSON.parse(e);return new Promise((e,n)=>{if("credentials"in navigator){var t=r.challenge;r.challenge=new Uint8Array(r.challenge),r.allowCredentials.forEach(function(e,n){r.allowCredentials[n].id=new Uint8Array(e.id)}),navigator.credentials.get({publicKey:r}).then(function(r){var n=[];new Uint8Array(r.rawId).forEach(function(e){n.push(e)});var a=JSON.parse(String.fromCharCode.apply(null,new Uint8Array(r.response.clientDataJSON))),i=[];new Uint8Array(r.response.clientDataJSON).forEach(function(e){i.push(e)});var o=[];new Uint8Array(r.response.authenticatorData).forEach(function(e){o.push(e)});var u=[];new Uint8Array(r.response.signature).forEach(function(e){u.push(e)});var c={type:r.type,originalChallenge:t,rawId:n,response:{authenticatorData:o,clientData:a,clientDataJSONarray:i,signature:u}};e(c)}).catch(function(e){"name"in e&&("AbortError"==e.name||"NS_ERROR_ABORT"==e.name||"NotAllowedError"==e.name)?n({message:"abort"}):n({message:e.toString()})})}else n("You broswer does not support webauthentication.")})}}}]);