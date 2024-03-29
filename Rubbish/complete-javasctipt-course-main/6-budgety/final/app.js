
// budget controller
var budgetController = (function (){
        
        var Expenses = function(id,description, value){
            this.id = id;
            this.description= description;
            this.value = value;
        }
        var Income = function(id,description, value){
            this.id = id;
            this.description= description;
            this.value = value;
        }
        var calculateTotal = function(type){
            var sum = 0;
            data.allItems[type].forEach(function(cur){
                sum += cur.value;
            });
            data.totals[type] = sum;
        };
        var data = {
            allItems:{
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc:0
        },
        budget : 0,
        percentage: -1,
    }
        return {
            addItem: function(type, des, val){
                var newItem,ID;
// create new id
if (data.allItems[type].length>0){
                ID = data.allItems[type][data.allItems[type].length -1].id+1;
}else {
    ID = 0;
}
                // create new item 
                if (type === 'exp'){
                newItem= new Expenses(ID, des , val);
                } else if(type === 'inc'){
                    newItem = new Income(ID, des , val);
                }
                // push into data structure
                data.allItems[type].push(newItem);
                // return the new element 
                return newItem;
            },


            calculateBudget: function(){
                // calculate total income and expenses 
                calculateTotal('exp');
                calculateTotal('inc');
                // calculate the budget : income - expenses
                data.budget = data.totals.inc - data.totals.exp;
                // calculate the percentage of income that we spent
                if (data.totals.inc > 0 ){

                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

                } else {
                    data.percentage = -1;
                }
            },

            getBudget: function(){
                return {
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage,
                }
            },
            
            testing: function(){
                console.log(data);
            }
        }


})();



// ui controller
var UIController = (function(){
        var DOMstrings={
            inputType: '.add__type',
            inputDescription: '.add__description',
            inputValue: '.add__value',
            inputBtn: '.add__btn',
            incomeContainer: '.income__list',
            expensesContainer: '.expenses__list',
            budgetLabel: '.budget__value',
            incomeLabel: '.budget__income--value',
            expensesLabel: '.budget__expenses--value',
            percentageLabel: '.budget__expenses--percentage',
            container: '.container',
        };
    
    
    return {
            getInput: function(){

                return {
                    type : document.querySelector(DOMstrings.inputType).value,
                    description : document.querySelector(DOMstrings.inputDescription).value,
                    value :parseFloat (document.querySelector(DOMstrings.inputValue).value)
                };
            },
            
            addListItem: function(obj, type){
                var html, newHtml, element;
                // create html with placeholder text

                if (type ==='inc'){
                    element = DOMstrings.incomeContainer;
                html ='<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button> </div> </div></div>';} else if (type === 'exp'){

                element = DOMstrings.expensesContainer;
                html ='<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">- %value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>';}
                // replace place holder text with actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);
                
                // instert the html into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
            },

            clearFields: function(){
            var fields, fieldsArr; 
                fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

                fieldsArr = Array.prototype.slice.call(fields);

                fieldsArr.forEach(function(current){

                    current.value = "";
                });
                fieldsArr[0].focus();
            },

            displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

            if (obj.percentage> 0 ){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+ '%';
            }else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';

            }
            },

            getDOMstrings: function(){
return DOMstrings
            }
                

            
        };
})();





// global app controller
var controller = (function(budgetCntrl, UICntrl){
        
        var DOM = UICntrl.getDOMstrings();

        var updateBudget = function(){

            // calculate the budget on the UI
            budgetCntrl.calculateBudget();
            // return the budget
            var budget = budgetCntrl.getBudget();
            // display the budget on the UI
            UICntrl.displayBudget(budget);
        };
        var ctrlAddItem = function(){
            var input , newItem;
            // get field input data
            input = UICntrl.getInput();
            

            if(input.description !== "" && !isNaN(input.value) && input.value > 0){

                // add item to the budget controller
            newItem = budgetCntrl.addItem(input.type, input.description, input.value);
            // add the item to the UI
            UICntrl.addListItem(newItem, input.type);
            // clear the fields
            UICntrl.clearFields();
            // calculate and update the budget on the UI
            updateBudget();
            };
            
            
        }
        var ctrlDeleteItem = (function(event){
                console.log(event.target.parentNode)
            })

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);


        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        

        document.addEventListener('keypress', function(event){
            if (event.which === 13){
                ctrlAddItem();
            }
        });
        


return {
    init: function(){
        UICntrl.displayBudget({
            budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1,
        })
    }
}

})(budgetController, UIController);