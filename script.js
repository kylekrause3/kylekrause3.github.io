console.log("have you heard of the game?");

function updateGreeting() {
    const hour = new Date().getHours();
    let greeting;


    if (hour < 5) {
        greeting = ". . . Z Z Z . . .";
    }
    else if (hour < 12) {
        greeting = "Good Morning!";
    }
    else if (hour < 18) {
        greeting = "Good Afternoon!";
    }
    else {
        greeting = "Good Evening!";
    }

    document.getElementById('greeting').textContent = greeting;
}

// Call the function when the page loads
updateGreeting();
