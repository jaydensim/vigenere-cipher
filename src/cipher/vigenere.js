const lettersArray = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

let utils = {
  getLetterPos(letter) {
    return lettersArray.indexOf(letter);
  },
  arrayRepeater(arr1, arr2) {
    let newArr2 = [];
    let arrRepIndex = 0;
    let arrRepMax = arr2.length;
    arr1.forEach((el, index) => {
      newArr2.push(arr2[arrRepIndex]);
      arrRepIndex++;
      if (arrRepIndex == arrRepMax) arrRepIndex = 0;
    });
    return newArr2;
  },
  sanitise(input) {
    let inputNew = input.toUpperCase();
    inputNew = inputNew.replace(/[^A-Z.]/g, "");
    return inputNew;
  },
};

function parseSentence(input) {
  let inputParsed = [];
  input.split("").forEach((letter) => {
    inputParsed.push(utils.getLetterPos(letter));
  });
  return inputParsed;
}

function cipherLetter(letter, key, direction) {
  let lettersShifted = lettersArray.map((x) => x);
  if (key != 0) {
    for (let i = 0; i < key; i++) {
      if (direction == "left") {
        let shiftedLetter = lettersShifted.shift();
        lettersShifted.push(shiftedLetter);
      } else if (direction == "right") {
        let shiftedLetter = lettersShifted.pop();
        lettersShifted.unshift(shiftedLetter);
      }
    }
  }
  return lettersShifted[letter];
}

function encode(parsedInput, parsedKey) {
  let encodedText = "";
  parsedInput.forEach((letter, iter) => {
    encodedText += cipherLetter(letter, parsedKey[iter], "left");
  });
  return encodedText;
}

function decode(typedEncodedInput, typedKey) {
  let encodedText = "";
  typedEncodedInput.forEach((letter, iter) => {
    encodedText += cipherLetter(letter, typedKey[iter], "right");
  });
  return encodedText;
}
export class Cipher {
  typedKey = [];

  constructor(key) {
    this.typedKey = parseSentence(utils.sanitise(key));
  }

  encrypt(input) {
    let typedInput = parseSentence(utils.sanitise(input));
    let parsedKey = utils.arrayRepeater(typedInput, this.typedKey);

    return encode(typedInput, parsedKey);
  }
  decrypt(input) {
    let typedEncodedInput = parseSentence(input);
    let parsedKey = utils.arrayRepeater(typedEncodedInput, this.typedKey);
    return decode(typedEncodedInput, parsedKey);
  }
}
