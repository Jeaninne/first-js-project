'use strict';
var rowCounter = counter();
var categoriesJSON = '["жилье","транспорт","еда","здоровье","гигиена","связь","одежда","развлечения","подарки","другое"]';

//we need this for counting rows, which were added by user
function counter() {
    var i = 1;
    return {
        increase: function increase() {
            return i++;
        },
        decrease: function decrease() {
            return i--;
        }
    }
}

function createDeleteButton(id) {
    var deleteButton = document.createElement('div');
    deleteButton.innerHTML = 'x';
    deleteButton.id = 'delete_' + id;
    deleteButton.className = 'delete-button';
    deleteButton.onclick = function() {
        deleteRow(this.id);
    };
    return deleteButton;
}

function createCategoriesSelect() {
    var categoryCounter = counter();
    var selectCategory = document.createElement('select');
    selectCategory.className = 'js-category';
    var categories = JSON.parse(categoriesJSON);
    categories.forEach(function(item) {
        var newOption = document.createElement('option');
        newOption.innerHTML = item;
        newOption.value = categoryCounter.increase();
        selectCategory.appendChild(newOption);
    });
    return selectCategory;
}

//this is shitcrafting. I need to rewrite it
function addRow() {
    var tBody = document.getElementsByTagName('tbody')[0];
    var tdBuy = document.createElement('td');
    tdBuy.appendChild(document.createElement('input'));


    var tdPrice = document.createElement('td');
    var priceInput = document.createElement('input');
    priceInput.className = 'js-price';
    tdPrice.appendChild(priceInput);

    var tdCategory = document.createElement('td');
    tdCategory.appendChild(createCategoriesSelect());

    var tdDate = document.createElement('td');
    tdDate.innerHTML = "<input type='date'>";

    var tdChange = document.createElement('td');
    tdChange.appendChild(createDeleteButton(rowCounter.increase()));

    var tr = document.createElement('tr');
    tr.appendChild(tdBuy);
    tr.appendChild(tdPrice);
    tr.appendChild(tdCategory);
    tr.appendChild(tdDate);
    tr.appendChild(tdChange);
    tBody.appendChild(tr);
    tdBuy.childNodes[0].focus();
}

function deleteRow(id) {
    var tBody = document.getElementsByTagName('tbody')[0];
    tBody.removeChild(document.getElementById(id).parentNode.parentNode);
    rowCounter.decrease();
}

var changeBudget = document.getElementById('change-budget');
changeBudget.onclick = function() {
    var budgetInput = document.getElementById('salary');
    budgetInput.removeAttribute('disabled');
    budgetInput.focus();
};

//it's kinda
function finishEditingBudget() {
    var budgetInput = document.getElementById('salary');
    if (isNaN(budgetInput.value)) {
        budgetInput.classList.add('error');
        budgetInput.focus();
    } else {
        budgetInput.disabled = true;
        budgetInput.classList.remove('error');
        countSpending()
    }
}

var categoryField = document.getElementById('result').getElementsByTagName('h2')[1];
categoryField.appendChild(createCategoriesSelect());

function parseTable(className) {
    var result = [];
    var rows = document.getElementsByClassName(className);
    for (var i = 0; i < rows.length; i++) {
        result.push(rows[i].value);
    }
    return result;
}

function countSpending() {
    var prices = parseTable('js-price');
    var categories = parseTable('js-category');
    var controlCategory = categories.pop(); //drunk, fix later
    var sum = 0;
    var sumInCategory = 0;
    for (var i = 0; i < categories.length; i++) {
        sum += +prices[i];
        if (categories[i] === controlCategory) {
            sumInCategory += +prices[i];
        }
    }
    document.getElementById('sum').innerText = sum.toString();
    document.getElementById('sumInCategory').innerText = sumInCategory.toString();

    var salary = +document.getElementById('salary').value;
    document.getElementById('ratio').innerText = (sum*100/salary).toFixed(2).toString() + ' %';
    document.getElementById('ratioInCategory').innerText = (sumInCategory*100/salary).toFixed(2).toString() + ' %';
}