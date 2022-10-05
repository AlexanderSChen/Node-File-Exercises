const fs = require('fs');
const process = require('process');
const axios = require('axios');

// function goes error first, if output is good then it writes to the file
function handleOutput(text, out) {
    if(out) {
        fs.writeFile(out, text, 'utf8', function(err) {
            if(err) {
                console.error(`Couldn't write ${out}: ${err}`);
                process.exit(1);
            }
        });
    } else {
        console.log(text);
    }
}

// read file at path and print it  out

function cat(path, out) {
    fs.readFile(path, 'utf8', function(err, data) {
        if(err) {
            console.error(`Error reading ${path}: ${err}`);
            process.exit(1);
        } else {
            handleOutput(data, out);
        }
    });
}

// read file at URL and print it out

async function webCat(url, out) {
    try {
        let resp = await axios.get(url);
        handleOutput(resp.data, out);
    } catch(err) {
        console.error(`Error fetching ${url}: ${err}`);
        process.exit(1);
    }
}

let path;
let out;

if(process.argv[2] === '--out') {
    out = process.argv[3];
    console.log(out);
    path = process.argv[4];
    console.log(path);
} else {
    path = process.argv[2];
    console.log(path);
}

if(path.slice(0, 4) === 'http') {
    webCat(path, out);
} else {
    cat(path, out);
}