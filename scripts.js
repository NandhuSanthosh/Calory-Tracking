// fetching data from localStorage
let localStorageData = localStorage.getItem("data");
const defaultData = {
    "goals": {
        "protein": 0, 
        "calories": 0, 
        "carbs": 0
    }, 
    "current": {
        "protein": 0, 
        "calories": 0, 
        "carbs": 0
    },
    "itemList": []
}
let data = localStorageData ? JSON.parse(localStorageData) : defaultData;
updateTarget();
updateMealList();

// modal form prefill function attaching
const myModal = document.getElementById('goalFormModal');
if(myModal) {
    myModal.addEventListener('show.bs.modal', function () {
        const caloryField = myModal.querySelector('input[name="calories"]');
        const proteinField = myModal.querySelector('input[name="protein"]');
        const carbField = myModal.querySelector('input[name="carbs"]')

        const { calories, protein, carbs} = data.goals

        if(parseInt(calories)) {
            caloryField.value = calories; 
        }
        if(parseInt(protein)) {
            proteinField.value = protein;
        }    
        if(parseInt(carbs)) {
            carbField.value = carbs;
        }
    });
}


const mealModal = document.getElementById('mealFormModal');


// add meal function
function addMeal(e)  {
    e.preventDefault();
    
    const formElement = e.target;

    const values = {
        id: new Date(),
        type: formElement.type.value || 0,
        item: formElement.item.value || 0,
        quantity: formElement.quantity.value || 0, 
        calories: formElement.calories.value || 0, 
        carbs: formElement.carbs.value || 0, 
        protein: formElement.protein.value || 0
    } 

    data.itemList.push(values);
    data.current = data.itemList.reduce( (acc, curr) => ({
        protein: parseInt(acc.protein) + parseInt(curr.protein), 
        carbs: parseInt(acc.carbs) + parseInt(curr.carbs), 
        calories: parseInt(acc.calories) + parseInt(curr.calories)
    }), {
        carbs: 0, 
        calories: 0, 
        protein: 0
    })

    updateData(data)
    updateTarget();
    updateMealList();

    // close modal
    if(mealModal) {
        const modal = bootstrap.Modal.getInstance(mealModal) || new bootstrap.Modal(mealModal);
        modal.hide();
    }
}


// update goals form submit handler
function updateGoals(e) {
    e.preventDefault();
    
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

// udpate summary section data
function updateTarget() {
    const { calories, protein, carbs } = data.goals;
    const { current } = data;

    const summary = document.querySelector('.summary')

    updateSummary(parseInt(calories), parseInt(current.calories), summary.querySelector('.calories'))
    updateSummary(parseInt(protein), parseInt(current.protein), summary.querySelector('.protein'))
    updateSummary(parseInt(carbs), parseInt(current.carbs), summary.querySelector('.carbs'))

    // update summary section data helper function
    function updateSummary(target, current, component) {
        if(target == 0) {
            component.classList.add('no-target')
            component.classList.remove('reached')
        }
        else if(target <= current) {
            component.classList.add('reached')
            component.classList.remove('no-target')
        }
        else {
            component.classList.remove('reached', 'no-target')
            component.querySelector('.balance-value').innerHTML = target - current
        }
        component.querySelector('.curr-value').innerHTML = current
        component.querySelector('.target-value').innerHTML = target
    }
}

// update data in localstorage
function updateData(newData) {
    localStorage.setItem("data", JSON.stringify(newData))
}

function updateMealList() {
    const mealListContainer = document.querySelector("#meal-list-container");
    mealListContainer.innerHTML = "";

    data.itemList.forEach( (curr) => {
        const gradientClasses = [
            "gradient-red", 
            "gradient-purple", 
            "gradient-blue", 
            "gradient-indigo"
        ]

        const types = {
            "pre-workout": "Pre-workout", 
            "post-workout": "Post-workout", 
            "breakfast": "Breakfast", 
            "evening": "Evening",
            "dinner": "Dinner",
            "additional": "Additional"
        }

        const container = document.createElement('div');
        container.classList.add('col-12', 'col-md-3', 'mb-3')
        
        let currTemplate = getMealCardTemplate(); 
        currTemplate = currTemplate.replace('{{gradient-class}}', gradientClasses[getRandom0to3()])
        currTemplate = currTemplate.replace('{{type}}', types[curr.type])
        currTemplate = currTemplate.replace('{{item}}', curr.item)
        currTemplate = currTemplate.replace('{{quantity}}', curr.quantity)
        currTemplate = currTemplate.replace('{{calories}}', curr.calories)
        currTemplate = currTemplate.replace('{{protein}}', curr.protein)
        currTemplate = currTemplate.replace('{{carbs}}', curr.carbs)

        container.innerHTML = currTemplate
        mealListContainer.append(container)
    })

}

function getRandom0to3() {
  return Math.floor(Math.random() * 4); 
}

// return the template of the meal card
// replace these values before rendering
// gradient-class, type, item, quantity, calories, protein, carbs
function getMealCardTemplate () {
    return `
            <div class="meal-card {{gradient-class}} d-flex flex-column gap-3 rounded">
                <div>
                    <span class="meal-type">{{type}}</span>
                </div>
                <div>
                    <span class="meal-item">{{item}}</span>
                </div>
                <div>
                    <span class="meal-quantity">{{quantity}} g</span>
                </div>
                <ul class="meal-property">
                    <li>
                        <span>{{calories}} Cals</span>
                    </li>
                    <li>
                        <span>{{protein}} g Protein</span>
                    </li>
                    <li>
                        <span>{{carbs}} g Carbs</span>
                    </li>
                </ul>
            </div>
    `
} 




