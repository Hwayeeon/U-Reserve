const baseString = 'Qq1Ww2Ee3Rr4Tt5Yy6Uu7Ii8Oo9Pp0Aa@Ss#Dd$Ff_Gg&Hh-Jj+Kk(Ll)Zz.Xx,Cc"Vv:Bb;Nn!Mm?{}[]/ ';
const d = new Date().getHours();

export function encrypt(plaintext, hidKeyword="alien@civitas.ukrida.ac.id", selKeyword="alien", name, hour) {
    const selKeywordTable = createTable(selKeyword);
    const keywordText = createKeywordText(plaintext.length, hidKeyword);
    let ciphertext = '';
    for (const x in plaintext) {
        const y = selKeywordTable[0].indexOf(plaintext[x]);
        const z = selKeywordTable[y].indexOf(keywordText[x]);
        const c = selKeywordTable[0][z];
        const baseStringIndex = baseString.indexOf(c);
        name ? ciphertext += (baseStringIndex+hour+30)*5 : ciphertext += (baseStringIndex+50)*5;
    }
    return ciphertext;
}

export function decrypt(ciphertext, hidKeyword="alien@civitas.ukrida.ac.id", selKeyword="alien", name, hour) {
    if (ciphertext) {
        let plaintext = '';
        const selKeywordTable = createTable(selKeyword);
        const ciphertextArray = ciphertext.match(/.{1,3}/g);
        const keywordText = createKeywordText(ciphertextArray.length, hidKeyword);
        for (const x in ciphertextArray) {
            const baseStringIndex = name ? parseInt(ciphertextArray[x]) / 5 - 30 - hour : parseInt(ciphertextArray[x]) / 5 - 50;
            const z = baseString[baseStringIndex];
            const y = selKeywordTable[0].indexOf(z);
            const p = selKeywordTable[y].indexOf(keywordText[x]);
            plaintext += selKeywordTable[0][p];
        }
        return plaintext;
    }
    return null;
}

export function encryptRole(plaintext, hidKeyword, selKeyword) {
    return encrypt(plaintext, hidKeyword, selKeyword, true, d);
}

export function decryptRole(ciphertext, hidKeyword, selKeyword) {
    return decrypt(ciphertext, hidKeyword, selKeyword, true, d);
}

function createTable(selKeyword) {
    const keywordArray = [...new Set(selKeyword)];
    for (const x in baseString) {
        if (! keywordArray.includes(baseString[x])) {
            keywordArray.push(baseString[x]);
        }
    }
    const keyString = keywordArray.join('');
    const table = [];
    for (const x in keywordArray) {
        let temp = keyString.slice(x);
        temp += keyString.slice(0, x);
        table.push([...temp]);
    }
    return table;
}

function createKeywordText(plaintextLength, hidKeyword) {
    let keywordText = '';
    if (hidKeyword.length > plaintextLength) {
        keywordText = hidKeyword.substring(0, plaintextLength);
    } else {
        const repeatCount = Math.floor(plaintextLength / hidKeyword.length);
        const remainder = plaintextLength % hidKeyword.length;
        keywordText = hidKeyword.repeat(repeatCount) + hidKeyword.substring(0, remainder);
    }
    return keywordText;
}