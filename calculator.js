calcArray = [];
tempArray = [];

function calculate(calcString) {
    calcArrayNums = [];
    inputValidation(calcString)
    cleanUpAndCreateArrays(calcString)

    //We need to follow the order of operations! First, let’s start with everything in parentheses. Then, we attack multiplication or division, whichever comes first, and then addition or subtraction, whichever comes first. Note, I didn’t include exponents, since it wasn’t a requirement (sorry exponents!) Below, you'll see I created functions for each PEMDAS step.
    while (calcArray.length > 1) {
        if (calcArray.includes("(")) {
            parentheses(calcArray)
        }
        multiplyDivide(calcArray)
        addSubtract(calcArray)
    }

    //Finally, as a last step, if there is only one number left, which will be the answer, it needs to be returned as the solution to the equation.
    if (calcArray.length === 1) {
        return calcArray
    }
}

//Let's validate the input to make sure it doesn't contain any unsupported or incorrect characters or formatting!
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

//First, we need to do a few things to clean up the input string. Let's remove all the spaces and replace any instances of two consecutive subtraction signs, or consecutive addition and subtraction signs, with their equivalents to make it easier to deal with one operator at a time.
//Secondly, I found a work around to deal with parentheses, since I was having trouble with them in regex. I simply replaced them with "a" and "b" and then swapped them back after the array has been made.
function cleanUpAndCreateArrays(calcString) {
    calcString = calcString.replace(/\s/g, '');
    calcString = calcString.replaceAll("/.", "/0.")
    calcString = calcString.replaceAll("*.", "*0.")
    calcString = calcString.replaceAll("(", "a")
    calcString = calcString.replaceAll(")", "b")
    calcString = calcString.replaceAll("--", "+")
    calcString = calcString.replaceAll("+-", "-")
    calcArrayNums = calcString.match(/(\d*\.)?\d+/gi);
    calcArray = calcString.match(/[^\w]+|[\d.]+|[\a-z+]/g);
    if (calcString[0] === "-") {
        calcArray.shift()
        calcArray[0] = "-" + calcArrayNums[0]
    }
    for (let i = 0; i < calcArray.length; i++) {
        if (calcArray[i] === "a") {
            calcArray[i] = "("
        }
        if (calcArray[i] === "b") {
            calcArray[i] = ")"
        }
    }
}
var innerParenthesesStart = 0;
var innerParenthesesEnd = 0;

//The below function accounts for parentheses, and then follows the standard order of operations within those parentheses.
function parentheses(calcArray) {
    for (let i = calcArray.length - 1; i >= 0; i--) {
        if (calcArray[i] === ")") {
            innerParenthesesEnd = i;
        }
        if (calcArray[i] === "(") {
            innerParenthesesStart = i;
            tempArray = calcArray.slice(innerParenthesesStart, innerParenthesesEnd + 1)
            multiplyDivide(tempArray, innerParenthesesStart, innerParenthesesEnd)
            addSubtract(tempArray, innerParenthesesStart, innerParenthesesEnd)
        }
    }
}

//The below function follows the "MD" part of "PEMDAS". Which ever comes first, multiplication or division, occurs. The two numbers are either multiplied or divided, and then the numbers are removed from the numbers array, and the operators are removed from the operators array.
//This function is also used by the parentheses function, where some more logic is involved. Take a look at the "if (innerParenthesesStart) {" portion. The program will take a specific portion of an equation that needs to be operated an, like "(2+2)" from "2/5*2+(2+2)" and apply the appropriate logic.
function multiplyDivide(array, innerParenthesesStart, innerParenthesesEnd) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === "*") {
            firstNum = (array[i - 1]);
            secondNum = (array[i + 1]);
            numResult = (firstNum * secondNum).toFixed(3)
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
            firstNum = (array[i - 1]);
            secondNum = (array[i + 1]);
            numResult = (firstNum / secondNum).toFixed(3)
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
        }
    }
}

//The below function follows the "AS" part of "PEMDAS". Which ever comes first, addition or subtraction, occurs. The two numbers are either subtracted or added, and then the numbers are removed from the numbers array, and the operators are removed from the operators array.
function addSubtract(array, innerParenthesesStart, innerParenthesesEnd) {
    for (let i = 0; i < array.length; i++) {
        if (array[i] === "+") {
            firstNum = (array[i - 1]);
            secondNum = (array[i + 1]);
            numResult = ((+firstNum) + (+secondNum)).toFixed(3)
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
            numResult = (firstNum - secondNum).toFixed(3)
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

//The below function will splice the data from the temporary array.
function tempArraySplicer(i, numResult) {
    tempArray.splice(i - 1, 3, numResult);
}

//The below function will splice the data from the temporary array.
function parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult) {
    var difference = (innerParenthesesEnd - innerParenthesesStart) + 1
    calcArray.splice(innerParenthesesStart, difference, numResult);
}

function splicer(i, numResult) {
    calcArray.splice(i - 1, 3, numResult);
}

//The below is needed for the webpage interaction for the input field and button.
var calculateButton = document.getElementById('calculate'),
    userInput = document.getElementById('userInput'),
    result = document.getElementById('result');
    calculateButton.addEventListener('click', function() {
    result.innerHTML = "The answer is " + (calculate(userInput.value));
});
