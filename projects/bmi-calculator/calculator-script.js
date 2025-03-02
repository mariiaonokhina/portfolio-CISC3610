// Defining variables within HTML Document
    // Buttons for Height
    inchesHeightButton = document.getElementById("inHeight");
    cmHeightButton = document.getElementById("cmHeight");

    // Buttons for Weight
    poundsWeightButton = document.getElementById("lbsWeight");
    kgWeightButton = document.getElementById("kgWeight");

    // Buttons for Sex (Should appear only if age < 21)
    maleButton = document.getElementById("male");
    femaleButton = document.getElementById("female");

    // Calculate Button
    calculateButton = document.getElementById("calculateButton");

    // Variables for inputs
    heightInput = document.getElementById("heightInput");
    weightInput = document.getElementById("weightInput");

    // Variable for BMI Output
    BMIvalue = document.getElementById("BMIvalue");
    BMImeaning = document.getElementById("BMImeaning");

    // Target all buttons
    buttons = document.getElementsByClassName("button");


// Animation - input value goes left on hover
$('input').focus(function(event) {
    $(this).closest('.inputField').addClass('float').addClass('focus');
  })
  
  $('input').blur(function() {
    $(this).closest('.inputField').removeClass('focus');
    if (!$(this).val()) {
      $(this).closest('.inputField').removeClass('float');
    }
  });


// Function for making buttons active and inactive
function activeButton(button, secondButton) {

  if (button.classList.contains("activeButton") == true) {

    button.classList.add("activeButton");

    secondButton.classList.remove("activeButton");

  } else {

    button.classList.remove("activeButton");

    secondButton.classList.add("activeButton");

  }

}


// Toggling buttons - making them active and inactive(choosing)
inchesHeightButton.onclick = function() {
  
  inchesHeightButton.classList.add("activeButton");
  activeButton(inchesHeightButton, cmHeightButton);

}

cmHeightButton.onclick = function() {

  cmHeightButton.classList.add("activeButton");
  activeButton(cmHeightButton, inchesHeightButton);

}

poundsWeightButton.onclick = function() {
  
  poundsWeightButton.classList.add("activeButton");
  activeButton(poundsWeightButton, kgWeightButton);

}

kgWeightButton.onclick = function() {

  kgWeightButton.classList.add("activeButton");
  activeButton(kgWeightButton, poundsWeightButton);

}

maleButton.onclick = function() {

  maleButton.classList.add("activeButton");
  activeButton(maleButton, femaleButton);

}

femaleButton.onclick = function() {

  femaleButton.classList.add("activeButton");
  activeButton(femaleButton, maleButton);

}


// Function for calculating the meaning of BMI
function meaningOfBmi(userBMI, bmiMeaning) {

  if (userBMI < 18.5) {

    bmiMeaning.innerText = "underweight";

    bmiMeaning.style.color = "blue";

  } 

  else if (userBMI >= 18.5 && userBMI < 25) {

    bmiMeaning.innerText = "normal";

    bmiMeaning.style.color = "green";

  }

  else if (userBMI >= 25 && userBMI <= 30) {

    bmiMeaning.innerText = "overweight";

    bmiMeaning.style.color = "orange";

  }

  else {

    bmiMeaning.innerText = "obese";

    bmiMeaning.style.color = "red";

  }

}


// Function for calculating BMI itself.
calculateButton.addEventListener("click", function(){

  // Deleting previous values after each click
  BMIvalue.innerText = "";
  BMImeaning.innerText = "";

  // Defining local variables for user input values
  userWeight = weightInput.value;

    // User has chosen inches and pounds
    if (inchesHeightButton.classList.contains("activeButton") && poundsWeightButton.classList.contains("activeButton")) {

      userHeight = heightInput.value;

      // Formula for BMI (inches and pounds)
      userBMI = Math.round((userWeight / (userHeight * userHeight) * 703) * 10) / 10;

      // Results
      BMIvalue.append(userBMI + " - ");

      meaningOfBmi(userBMI, BMImeaning);

    }

    // User has chosen cm and kg
    else if (cmHeightButton.classList.contains("activeButton") && kgWeightButton.classList.contains("activeButton")) {

      // To get meters instead of cm
      userHeight = heightInput.value / 100;     

      // Formula for BMI (cm and kg)
      userBMI = Math.round(userWeight / (userHeight * userHeight) * 10) / 10;

      // Results
      BMIvalue.append(userBMI + " - ");

      meaningOfBmi(userBMI, BMImeaning);

    }

    // User has chosen inches and kg (Two different measuring systems)
    else if (inchesHeightButton.classList.contains("activeButton") && kgWeightButton.classList.contains("activeButton")) {

      // Converting inches into meters - divide by 39.37
      userHeight = heightInput.value / 39.37;    ;

      // Using BMI formula for meters and kg
      userBMI = Math.round(userWeight / (userHeight * userHeight) * 10) / 10;

      // Results
      BMIvalue.append(userBMI + " - ");

      meaningOfBmi(userBMI, BMImeaning);

    }

    // User has chosen cm and lbs (Two different measuring systems)
    else if (cmHeightButton.classList.contains("activeButton") && poundsWeightButton.classList.contains("activeButton")) {

      // To get meters instead of cm
      userHeight = heightInput.value / 100;   

      // Using BMI formula for meters and kg. To convert pounds to kg, divide pounds by 2.205
      userBMI = Math.round((userWeight / 2.205) / (userHeight * userHeight) * 10) / 10;

      // Results
      BMIvalue.append(userBMI + " - ");

      meaningOfBmi(userBMI, BMImeaning);

    }

    // User has not chosen any button or chose only height/weight
    else {

      alert("Please, choose a measurement system for both height and weight.");

    }

});