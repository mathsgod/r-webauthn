module.exports = {
    mode: "production",
    entry: [
        "./src/WebAuthn.js"
    ],
    output: {
        library: "WebAuthn",
        libraryTarget: "window"
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    }
};