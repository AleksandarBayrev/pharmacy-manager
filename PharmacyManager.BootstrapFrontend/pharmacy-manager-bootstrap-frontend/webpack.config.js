const path = require('path');

const isProduction = process.env.NODE_ENV == 'production';


const config = {
    entry: './build/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'pharmacymanager-bootstrap.js'
    },
    plugins: [],
    module: {
        rules: [],
    },
    devtool: 'source-map'
};

module.exports = () => {
    if (isProduction) {
        config.mode = 'production';
        
        
    } else {
        config.mode = 'development';
    }
    return config;
};
