calcArrayOperators = [];
tempArray = [];

function calculate(calcString) {
    calcArrayNums = [];
    inputValidation(calcString)
    cleanUpAndCreateArrays(calcString)
    while (calcArrayOperators.length > 1) {
        if (calcArrayOperators.includes("(")) {
            parentheses(calcArrayOperators)
        }
        multiplyDivide(calcArrayOperators)
        addSubtract(calcArrayOperators)
    }
    if (calcArrayOperators.length === 1) {
        return calcArrayOperators
    }
}

function inputValidation(calcString) {
    var regExp = /[a-zA-Z]/g;
    if (regExp.test(calcString)) {
        alert("Your input cannot contain any letters!");
    }
    const invalidOperators = calcString.includes("--+") || calcString.includes("++") || calcString.includes('-+') || calcString.includes('+-+') || calcString.includes('+--');
    if (invalidOperators) {
        alert("Cannot contain those consecutive operators!");
    }
}

function cleanUpAndCreateArrays(calcString) {
    calcString = calcString.replace(/\s/g, '');
    calcString = calcString.replaceAll("/.", "/0.")
    calcString = calcString.replaceAll("/-.", "/-0.")
    calcString = calcString.replaceAll("(", "a")
    calcString = calcString.replaceAll(")", "b")
    calcString = calcString.replaceAll("--", "+")
    calcString = calcString.replaceAll("+-", "-")
    calcArrayNums = calcString.match(/(\d*\.)?\d+/gi);
    calcArrayOperators = calcString.match(/[^\w]+|[\d.]+|[\a-z+]/g);
    if (calcString[0] === "-") {
        calcArrayOperators.shift()
        calcArrayOperators[0] = "-" + calcArrayNums[0]
    }
    for (let i = 0; i < calcArrayOperators.length; i++) {
        if (calcArrayOperators[i] === "a") {
            calcArrayOperators[i] = "("
        }
        if (calcArrayOperators[i] === "b") {
            calcArrayOperators[i] = ")"
        }
    }
    console.log(calcArrayOperators)
}
var innerParenthesesStart = 0;
var innerParenthesesEnd = 0;

function parentheses(calcArrayOperators) {
    console.log("paren reached", calcArrayOperators)
    for (let i = calcArrayOperators.length - 1; i >= 0; i--) {
        if (calcArrayOperators[i] === ")") {
            innerParenthesesEnd = i;
            console.log("innerParenthesesEnd", i)
        }
        if (calcArrayOperators[i] === "(") {
            innerParenthesesStart = i;
            console.log("innerParenthesesStart", innerParenthesesStart)
            tempArray = calcArrayOperators.slice(innerParenthesesStart, innerParenthesesEnd + 1)
            console.log("tempArray", tempArray)
            multiplyDivide(tempArray, innerParenthesesStart, innerParenthesesEnd)
            addSubtract(tempArray, innerParenthesesStart, innerParenthesesEnd)
        }
    }
}

function multiplyDivide(array, innerParenthesesStart, innerParenthesesEnd) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === "*") {
            firstNum = (array[i - 1]);
            secondNum = (array[i + 1]);
            numResult = (firstNum * secondNum).toFixed(4)
            if (innerParenthesesStart) {
                tempArraySplicer(i, numResult)
                if (array.includes("*") || array.includes("/")) {
                    multiplyDivide(array, innerParenthesesStart, innerParenthesesEnd)
                } else if (array.includes("+") || array.includes("-")) {
                    addSubtract(array, innerParenthesesStart, innerParenthesesEnd)
                } else {
                    parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult)
                }
            } else {
                splicer(i, numResult)
                if (array.includes("*") || array.includes("/")) {
                    multiplyDivide(array)
                }
            }
        } else if (array[i] === "/") {
            console.log("division reached")
            firstNum = (array[i - 1]);
            secondNum = (array[i + 1]);
            numResult = (firstNum / secondNum).toFixed(4)
            console.log("array for ", array)
            console.log("numResult for ", numResult)
            console.log("overall for ", calcArrayOperators)
            if (innerParenthesesStart) {
                tempArraySplicer(i, numResult)
                console.log("after division splice", calcArrayOperators)
                if (array.includes("*") || array.includes("/")) {
                    multiplyDivide(array, innerParenthesesStart, innerParenthesesEnd)
                } else if (array.includes("+") || array.includes("-")) {
                    addSubtract(array, innerParenthesesStart, innerParenthesesEnd)
                } else {
                    parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult)
                }
            } else {
                splicer(i, numResult)
                if (array.includes("*") || array.includes("/")) {
                    addSubtract(array)
                }
            }
        }
    }
}

function addSubtract(array, innerParenthesesStart, innerParenthesesEnd) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === "+") {
            firstNum = (array[i - 1]);
            secondNum = (array[i + 1]);
            numResult = ((+firstNum) + (+secondNum)).toFixed(4)
            if (innerParenthesesStart) {
                tempArraySplicer(i, numResult)
                if (array.includes("+") || array.includes("-")) {
                    addSubtract(array, innerParenthesesStart, innerParenthesesEnd)
                } else if (array.includes("*") || array.includes("/")) {
                    multiplyDivide(array, innerParenthesesStart, innerParenthesesEnd)
                } else {
                    parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult)
                }
            } else {
                splicer(i, numResult)
                if (array.includes("+") || array.includes("-")) {
                    addSubtract(array)
                }
            }
        } else if (array[i] === "-") {
            firstNum = (array[i - 1]);
            secondNum = (array[i + 1]);
            numResult = (firstNum - secondNum).toFixed(4)
            if (innerParenthesesStart) {
                tempArraySplicer(i, numResult)
                if (array.includes("+") || array.includes("-")) {
                    addSubtract(array, innerParenthesesStart, innerParenthesesEnd)
                } else if (array.includes("*") || array.includes("/")) {
                    multiplyDivide(array, innerParenthesesStart, innerParenthesesEnd)
                } else {
                    parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult)
                }
            } else {
                splicer(i, numResult)
                if (array.includes("+") || array.includes("-")) {
                    addSubtract(array)
                }
            }
        }
    }
}

function tempArraySplicer(i, numResult) {
    console.log("temp splicer reached before", numResult)
    tempArray.splice(i - 1, 3, numResult);
    console.log("temp splicer reached before", tempArray)
}

function parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult) {
    var difference = (innerParenthesesEnd - innerParenthesesStart) + 1
    calcArrayOperators.splice(innerParenthesesStart, difference, numResult);
    if (calcArrayOperators.includes("(") || calcArrayOperators.includes(")")) {
        parentheses(calcArrayOperators)
    }
}

function splicer(i, numResult) {
    calcArrayOperators.splice(i - 1, 3, numResult);
}

//The below is needed for the webpage interaction for the input field and button.
var calculateButton = document.getElementById('calculate'),
    userInput = document.getElementById('userInput'),
    result = document.getElementById('result');
    calculateButton.addEventListener('click', function() {
    result.innerHTML = "The answer is " + (calculate(userInput.value));
});
