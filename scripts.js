// fetching data from localStorage
let localStorageData = localStorage.getItem("data");
const defaultData = {
    "goals": {
        "protein": 0, 
        "calories": 0, 
        "carbs": 0
    }, 
    "current": {
        "protein": 1000, 
        "calories": 0, 
        "carbs": 0
    },
    "itemList": []
}
let data = localStorageData ? JSON.parse(localStorageData) : defaultData;
updateTarget();
console.log(data)


// modal form prefill
const myModal = document.getElementById('goalFormModal');
if(myModal) {
    myModal.addEventListener('show.bs.modal', function () {
        const caloryField = myModal.querySelector('input[name="calories"]');
        const proteinField = myModal.querySelector('input[name="protein"]');
        const carbField = myModal.querySelector('input[name="carbs"]')

        const { calories, protein, carbs} = data.goals

        caloryField.value = calories; 
        proteinField.value = protein;
        carbField.value = carbs;
    });
}

function updateGoals(e) {
    e.preventDefault();
    
    // Access the form element
    const formElement = e.target;

    const values = {
        calories: formElement.calories.value || 0, 
        carbs: formElement.carbs.value || 0, 
        protein: formElement.protein.value || 0
    }   

    if(data) {
        data.goals = values;
    }
    else {
        data = {
            goals: values
        }
    }

    // update in data
    updateData(data)
    
    // update in ui
    updateTarget();

    // close modal
    if(myModal) {
        const modal = bootstrap.Modal.getInstance(myModal) || new bootstrap.Modal(myModal);
        modal.hide();
    }
}


function updateData(newData) {
    localStorage.setItem("data", JSON.stringify(newData))
}

function updateTarget() {
    const { calories, protein, carbs } = data.goals;
    const { current } = data;

    const summary = document.querySelector('.summary')

    updateSummary(parseInt(calories), parseInt(current.calories), summary.querySelector('.calories'))
    updateSummary(parseInt(protein), parseInt(current.protein), summary.querySelector('.protein'))
    updateSummary(parseInt(carbs), parseInt(current.carbs), summary.querySelector('.carbs'))
}

function updateSummary(target, current, component) {
    if(target <= current) {
        component.classList.add('reached')
    }
    else {
        component.classList.remove('reached')
        component.querySelector('.balance-value').innerHTML = target - current
    }
    component.querySelector('.curr-value').innerHTML = current
    component.querySelector('.target-value').innerHTML = target
}




