module.exports = {
    mode: "production",
    entry: [
        "./src/WebAuthn.js"
    ],
    output: {
        library: "WebAuthn",
        libraryTarget: "window"
    }
};