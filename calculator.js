calcArray = [];
tempArray = [];
var innerParenthesesStart = '';
var innerParenthesesEnd = '';
var inputValidationError = false;

function calculate(calcString) {
    inputValidation(calcString)
    cleanUpAndCreateArray(calcString)

//We need to follow the order of operations! First, let’s start with everything in parentheses. Then, we attack multiplication or division, whichever comes first, and then addition or subtraction, whichever comes first. Note, I didn’t include exponents, since it wasn’t a requirement (sorry exponents!) Below, you'll see I created functions for each PEMDAS step.
if (inputValidationError!==true){
while (calcArray.length > 1) {
        if (calcArray.includes("(")) {
            parentheses(calcArray)
        }
        multiplyDivide(calcArray)
        addSubtract(calcArray)
    }
}
else{
    return "Please enter a valid input."
}

//As a last step, if there is only one number left, which will be the answer, it needs to be returned as the solution to the equation.
    if (calcArray.length === 1) {
        return calcArray
    }
}

//Let's validate the input to make sure it doesn't contain any unsupported or incorrect characters or formatting!
function inputValidation(calcString) {
    var regExp = /[a-zA-Z]/g;
    if (regExp.test(calcString)) {
        alert("Your input cannot contain any letters!");
        inputValidationError = true;
    }
    const invalidOperators = calcString.includes("--+") || calcString.includes("---") || calcString.includes("++") || calcString.includes('-+') || calcString.includes('+-+') || calcString.includes('+--');
    if (invalidOperators) {
        alert("Your input cannot contain those consecutive operators!");
        inputValidationError = true;
    }
}

//First, we need to do a few things to clean up the input string. Let's remove all of the spaces and replace any instances of two consecutive subtraction signs, or consecutive addition and subtraction signs, with their equivalents to make it easier to deal with one operator at a time.
//(Note: I know the below method isn't the most efficient way to parse the array, and I'm currently working on creating a better method.)
//Secondly, I found a work around to deal with parentheses, since I was having trouble with them in regex. I simply replaced them with "a" and "b" and then swapped them back after.
function cleanUpAndCreateArray(calcString) {
    calcString = calcString.replace(/\s/g, '');
    calcString = calcString.replaceAll("/.", "/0.")
    calcString = calcString.replaceAll("*.", "*0.")
    calcString = calcString.replaceAll("+.", "+0.")
    calcString = calcString.replaceAll("-.", "-0.")
    calcString = calcString.replaceAll("(.", "(0.")
    calcString = calcString.replaceAll("--", "+")
    calcString = calcString.replaceAll("+-", "-")
    //I had to address a few pesky bugs, like the below, where the program had an issue with a parentheses appearing at the beginning of the user input string. However, I've added a fix below, and I'm going to figure out the root cause.
    if (calcString[0] === "("){
        calcString = "0+"+calcString
    }
    calcString = calcString.replaceAll("(", "a")
    calcString = calcString.replaceAll(")", "b")
    //Now, let's create the array with the numbers and symbols separated.
    calcArray = calcString.match(/[^\w]+|[\d.]+|[\a-z+]/g);
    //An error occurs if a negative is the first symbol in the string. Let's replace with "0-", since it represents the same thing and won't affect the equation.
    if (calcString[0] === "-") {
        calcArray.shift()
        calcArray[0] = "-" + calcArray[0]
    }
    //Now, let's put the parentheses back, as well as address the problematic symbols that still need to be separated. For example, "/-" needs to be changed to "/" and "-", as two separate symbols. The way I currently have regex set tup doesn't account for this, but I'm working to change that.
    for (let i = 0; i < calcArray.length; i++) {
        if (calcArray[i] === "a") {
            calcArray[i] = "("
        }
        if (calcArray[i] === "b") {
            calcArray[i] = ")"
        }
        if (calcArray[i] === "/-") {
            calcArray.splice(i, 1, "/");
            calcArray[i+1] = "-" + calcArray[i+1];
        }
        if (calcArray[i] === "*-") {
            calcArray.splice(i, 1, "*");
            calcArray[i+1] = "-" + calcArray[i+1];
        }
        if (calcArray[i] === "/-.") {
            calcArray.splice(i, 1, "/");
            calcArray[i+1] = "-." + calcArray[i+1];
        }
        if (calcArray[i] === "*-.") {
            calcArray.splice(i, 1, "*");
            calcArray[i+1] = "-." + calcArray[i+1];
        }
    }
}

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
        var firstNum = (array[i - 1]);
        var secondNum = (array[i + 1]);
        var numResult = '';
        if (array[i] === "*") {
            var numResult = (firstNum * secondNum).toFixed(3)
        } else if (array[i] === "/") {
            var numResult = (firstNum / secondNum).toFixed(3)
        }
        if (numResult) {
            if (innerParenthesesStart) {
                tempArraySplicer(i, numResult)
                if (array.includes("*" || "/")) {
                    multiplyDivide(array, innerParenthesesStart, innerParenthesesEnd)
                } else if (array.includes("+" || "-")) {
                    addSubtract(array, innerParenthesesStart, innerParenthesesEnd)
                } else {
                    parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult)
                }
            } else {
                splicer(i, numResult)
                if (array.includes("*" || "/")) {
                    multiplyDivide(array)
                }
            }
        }
    }
}

//The below function follows the "AS" part of "PEMDAS". Which ever comes first, addition or subtraction, occurs. The two numbers are either subtracted or added, and then the numbers are removed from the numbers array, and the operators are removed from the operators array.
function addSubtract(array, innerParenthesesStart, innerParenthesesEnd) {
    for (let i = 0; i < array.length; i++) {
        var firstNum = (array[i - 1]);
        var secondNum = (array[i + 1]);
        var numResult = '';
        if (array[i] === "+") {
            numResult = ((+firstNum) + (+secondNum)).toFixed(3)
        }
        if (array[i] === "-") {
            numResult = (firstNum - secondNum).toFixed(3)
        }
        if (numResult) {
            if (innerParenthesesStart) {
                tempArraySplicer(i, numResult)
                if (array.includes("+" || "-")) {
                    addSubtract(array, innerParenthesesStart, innerParenthesesEnd)
                } else if (array.includes("*" || "/")) {
                    multiplyDivide(array, innerParenthesesStart, innerParenthesesEnd)
                } else {
                    parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult)
                }
            } else {
                splicer(i, numResult)
                if (array.includes("+" || "-")) {
                    addSubtract(array)
                }
            }
        }
    }
}

//This function modifies the original array once each calculation is complete.
function splicer(i, numResult) {
    calcArray.splice(i - 1, 3, numResult);
}

//The below function will splice the data from the temporary array.
function tempArraySplicer(i, numResult) {
    tempArray.splice(i - 1, 3, numResult);
}

//The below function will splice the parentheses data from the original array once the equation inside the parentheses has been completed.
function parenthesesSplicer(innerParenthesesStart, innerParenthesesEnd, numResult) {
    var difference = (innerParenthesesEnd - innerParenthesesStart) + 1
    calcArray.splice(innerParenthesesStart, difference, numResult);
    if (calcArray.includes("(") || calcArray.includes(")")) {
        parentheses(calcArray)
    }
}

//The below is needed for the webpage interaction for the input field and button.
var calculateButton = document.getElementById('calculate'),
    userInput = document.getElementById('userInput'),
    result = document.getElementById('result');
    calculateButton.addEventListener('click', function() {
    result.innerHTML = (calculate(userInput.value));
});