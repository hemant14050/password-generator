console.log("Hello DEVs...");

const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]"); 
const passwordDisplay = document.querySelector("[data-password]");
const copyBtn = document.querySelector(".copy-btn");
const copyMsg = document.querySelector("span[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-strength");
const allCheckBoxes = document.querySelectorAll("input[type=checkbox]");

var password = "";
var passwordLength = 10;
var checkCount = 0;
handleSlider();
setIndicator("#ccc");
// set strength circle color to grey


// set passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    // min max
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength-min)*100/(max-min)+"%")+" 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    // indicator.style.cssText = `background-color: ${color}; 
    //                            box-shadow: 0 0 0 2px ${color.replace('0','9')};`;
}

function getRandInt(min, max) {
    return Math.floor(Math.random()*(max - min)) + min;
}

function generateRandomNumber() {
    return getRandInt(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRandInt(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandInt(65, 91));
}

function generateSymbol() {
    let symbols = "~!@#$%^&*(){}[]|/\-=+;:'?<>.,";
    let idx = getRandInt(0, symbols.length-1)
    return symbols.charAt(idx);
} 

function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbols.checked) hasSym = true;

    if(hasUpper && hasLower && (hasSym || hasNum) && passwordLength>=8) {
        setIndicator("#0f0");
    } else if((!hasLower || hasUpper) && (!hasNum || hasSym) && passwordLength>=6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent() {
    // it returns promise
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied! ";

    } catch(e) {
        copyMsg.innerText = "Failed! ";
    }
    // copyMsg.classList.add("active");
    copyMsg.removeAttribute("hidden");

    setTimeout(() => {
        // copyMsg.classList.remove("active");
        copyMsg.setAttribute("hidden", "hidden");
    }, 2000);
}

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) copyContent();
});

function handleCheckBoxChange() {
     checkCount = 0;
     allCheckBoxes.forEach((checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }
     });

     if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
     }
}

allCheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

function shufflePassword(arr) {
    // fisher yates method
    for(let i=arr.length-1; i>=0; i--) {
        const j=Math.floor(Math.random() * (i+1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let str = "";
    arr.forEach((ch) => str += ch);
    return str;
}

generateBtn.addEventListener('click', () => {
    // none checked
    if(checkCount <= 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // to find new password
    // first remove old pass
    password = "";
    
    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }
    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funArr = [];
    if(uppercaseCheck.checked) {
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked) {
        funArr.push(generateLowerCase);
    }
    if(numbersCheck.checked) {
        funArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked) {
        funArr.push(generateSymbol);
    }

    // compulsory addtion
    for(let i=0; i<funArr.length; i++) {
        password += funArr[i]();
    }

    for(let i=0; i<passwordLength-funArr.length; i++) {
        let randIdx = getRandInt(0, funArr.length);
        password += funArr[randIdx]();
    }

    password = shufflePassword(Array.from(password));
    
    // show
    passwordDisplay.value = password;
    calculateStrength();
});