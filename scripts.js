const gradientClasses = [
    "gradient-red", 
    "gradient-purple", 
    "gradient-blue", 
    "gradient-indigo"
]

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
if(myModal) {
    mealModal.addEventListener('show.bs.modal', function () {
        updateForm();
    });
}

// add meal function
function addMeal(e)  {
    e.preventDefault();

    const formElement = e.target;

    const values = {
        // id: new Date().getTime(),
        id: formElement.recordId.value,
        type: formElement.type.value || 0,
        item: formElement.item.value || 0,
        quantity: formElement.quantity.value || 0, 
        calories: formElement.calories.value || 0, 
        carbs: formElement.carbs.value || 0, 
        protein: formElement.protein.value || 0, 
        gradientClass: gradientClasses[getRandom0to3()]
    } 

    if(values.id) {
        data.itemList = data.itemList.map( curr => {
            console.log(curr.id, values.id)
            if(curr.id == values.id) {
                return values;
            }
            return curr;
        })
    }
    else {
        values.id = new Date().getTime();
        data.itemList.push(values);
    }

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

// edit meal handler
function editMeal(record) {
    const idField = document.getElementById('recordId_forEdit');
    idField.value = record.id
    if(mealModal) {
        const modal = bootstrap.Modal.getInstance(mealModal) || new bootstrap.Modal(mealModal);
        modal.show();
        updateForm(record)
    }
}

// prefill or remove meal form fields
function updateForm(record) {
    const form = document.getElementById('meal-form');
    if(form) {
        form.querySelector('input[name="recordId"]').value = record?.id || "";
        form.querySelector('select[name="type"]').value = record?.type || "";
        form.querySelector('input[name="item"]').value = record?.item || "";
        form.querySelector('input[name="quantity"]').value = record?.quantity || "";
        form.querySelector('input[name="calories"]').value = record?.calories || "";
        form.querySelector('input[name="protein"]').value = record?.protein || "";
        form.querySelector('input[name="carbs"]').value = record?.carbs || "";
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
        currTemplate = currTemplate.replace('{{gradient-class}}', curr.gradientClass)
        currTemplate = currTemplate.replace('{{type}}', types[curr.type])
        currTemplate = currTemplate.replace('{{item}}', curr.item)
        currTemplate = currTemplate.replace('{{quantity}}', curr.quantity)
        currTemplate = currTemplate.replace('{{calories}}', curr.calories)
        currTemplate = currTemplate.replace('{{protein}}', curr.protein)
        currTemplate = currTemplate.replace('{{carbs}}', curr.carbs)

        container.innerHTML = currTemplate
        
        const updateButton = container.querySelector('.meal-update-button');
        updateButton.addEventListener("click", () => {
            editMeal(curr)
        })

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
                <div class="d-flex justify-content-between align-items-center" >
                    <div>
                        <span class="meal-type">{{type}}</span>
                    </div>
                    <button class="border-0 bg-transparent meal-update-button">
                        <i class="fa-regular fa-pen-to-square" style="color: white"></i>
                    </button>
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




