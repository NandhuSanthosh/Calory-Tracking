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
console.log(data)


// modal form prefill function attaching
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
}

// update data in localstorage
function updateData(newData) {
    console.log(newData)
    localStorage.setItem("data", JSON.stringify(newData))
}

function updateMealList() {
    const mealListContainer = document.querySelector("#meal-list-container");
    mealListContainer.innerHTML = "";

    data.itemList.forEach( (curr) => {
        console.log(curr)
        const container = document.createElement('div');
        container.classList.add('col-12', 'col-md-3', 'mb-3')
        
        let currTemplate = getMealCardTemplate(); 
        currTemplate = currTemplate.replace('{{gradient-class}}', 'gradient-red')
        currTemplate = currTemplate.replace('{{type}}', curr.type)
        currTemplate = currTemplate.replace('{{item}}', curr.item)
        currTemplate = currTemplate.replace('{{quantity}}', curr.quantity)
        currTemplate = currTemplate.replace('{{calories}}', curr.calories)
        currTemplate = currTemplate.replace('{{protein}}', curr.protein)
        currTemplate = currTemplate.replace('{{carbs}}', curr.carbs)

        container.innerHTML = currTemplate
        mealListContainer.append(container)
    })

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




