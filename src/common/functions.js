/* 
    Common functions
    Multiple Uses
*/

// Get a random color value
function getRandomColor() {
    return "#" + ((Math.random() * (1 << 24)) | 0).toString(16);
}

// Get a random integer between min and max
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// String prototype format function similar to python
function formatString(str, args = []) {
    var i = 0;
    return str.replace(/{}/g, function () {
        return typeof args[i] != "undefined" ? args[i++] : "";
    });
};

// Shuffle an array
function shuffleArray(array) {
    var currentIndex = array.length,
        temporaryValue,
        randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

export { getRandomColor, randInt, shuffleArray, formatString };
