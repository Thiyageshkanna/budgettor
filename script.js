var budgetController = (function () {
  // function constructor

  var Expenditure = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //  Creating a private function which stores total income and expenses

  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach(function (cur) {
      sum += cur.value;
    });

    data.totals[type] = sum;
  };

  // object method to store the income and expenditure

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItems: function (type, des, val) {
      var newItem, ID;

      // create a new id

      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      //  adding a new inc or exp item with function constructor
      if (type === "inc") {
        newItem = new Income(ID, des, val);
      } else if (type === "exp") {
        newItem = new Expenditure(ID, des, val);
      } else {
        console.log("error");
      }

      // adding the new item to data structure
      data.allItems[type].push(newItem);
      return newItem;
    },

    deleteItem: function (type, id) {
      var ids, index;

      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal("inc");
      calculateTotal("exp");
      // calculate income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      // percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testing: function () {
      console.log(data);
    },
  };
})();

var UIController = (function () {
  // use this object type method when changes occurs in html  just change here then it is easier to use
  var domString = {
    type: ".custom-select",
    description: ".description",
    value: ".value",
    submit: ".submit-btn",
    incomeContainer: ".income-list",
    expenseContainer: ".expenditure-list",
    budgetLabel: ".budget-label",
    incomeLabel: ".income-span",
    expenseLabel: ".Expenditure-span",
    eventParent: ".delegation-parent",
    date: ".date",
  };

  var formatNumber = function (num, type) {
    var numSplit, int, dec;

    num = Math.abs(num);
    // +ve or -ve
    num = num.toFixed(2);
    // 2432.2356 ==> 2432.23

    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3 && int.length <= 5) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    } else if (int.length > 5) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    }

    dec = numSplit[1];

    return (type == "exp" ? "-" : "+") + " " + int + "." + dec;
  };
  //  returning a function to use it in public ( to make it accesible globally)
  return {
    getInput: function () {
      return {
        Type: document.querySelector(domString.type).value,
        secondDescription: document.querySelector(domString.description).value,
        thirdValue: parseFloat(document.querySelector(domString.value).value),
      };
    },

    // inserting items to the ui

    // 1.create a HTML string with placeholder text

    addListItem: function (obj, type) {
      var html, newHtml, element;
      if (type === "inc") {
        element = domString.incomeContainer;
        html =
          ' <tr id="inc-%id%" class="hoving slow" ><th scope="row" class="item-description text-capitalize">%description%</th><td class=" icp" class="item-value" id="value-inc">%value%   <i class="icon-close ml-3 far fa-window-close item-delete"></i></td></tr>';
      } else if (type === "exp") {
        element = domString.expenseContainer;
        html =
          '  <tr id="exp-%id% " class="hoving slow"><th scope="row" class="item-description text-capitalize">%description%</th><td class="item-value" id="value-exp">%value%   <i class="icon-close ml-3 far fa-window-close item-delete"></i></td></tr>';
      }
      // 2. Replace the placeholder with actual data

      newHtml = html.replace("%id%", obj.id);

      newHtml = newHtml.replace("%description%", obj.description);

      // dont include html.replace bcoz if you do so whatever in the html remains same and the above changes does not occur  "(%id%,obj.id ) will not change"

      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));

      // 3.insert the actual data into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function (selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearfields: function () {
      var field, fieldArr;

      field = document.querySelectorAll(
        domString.description + "," + domString.value
      );
      fieldArr = Array.prototype.slice.call(field);

      fieldArr.forEach(function (a, b, c) {
        a.value = "";
      });
      fieldArr[0].focus();
    },

    // creating a method which  insert the value

    displayBudget: function (obj) {
      var type;
      obj.budget >= 0 ? (type = "inc") : (type = "exp");
      document.querySelector(domString.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(domString.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(domString.expenseLabel).textContent = formatNumber(
        obj.totalExp,
        "exp"
      );
    },

    displayDate: function () {
      var now, month, months;
      now = new Date();

      months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      month = now.getMonth();
      console.log(month);

      year = now.getFullYear();

      document.querySelector(domString.date).textContent =
        " " + months[month] + " " + year;
    },

    //  we are using this method to make this method as public so that other function can use this method function (This will be used in Controller.setuplisteners)

    getDomString: function () {
      return domString;
    },
  };
})();

var Controller = (function (budgetCtrl, UICtrl) {
  var DOM = UIController.getDomString();
  var setUpEventListeners = function () {
    document.querySelector(DOM.submit).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.eventParent)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function () {
    // 1. calculate the budget

    budgetController.calculateBudget();

    // 2.return budget

    var budget = budgetController.getBudget();

    // 3.display the budget in user interface
    UIController.displayBudget(budget);
  };

  var ctrlAddItem = function () {
    var inputSubmit, newItems;

    // 1. get the field input data

    inputSubmit = UIController.getInput();

    if (
      inputSubmit.secondDescription !== "" &&
      isNaN(inputSubmit.secondDescription) &&
      !isNaN(inputSubmit.thirdValue) &&
      inputSubmit.thirdValue > 0
    ) {
      // 2.add the data to budget controller
      newItems = budgetController.addItems(
        inputSubmit.Type,
        inputSubmit.secondDescription,
        inputSubmit.thirdValue
      );

      // 3. add the data to ui controller

      UIController.addListItem(newItems, inputSubmit.Type);

      // 4. clear the inputs

      UIController.clearfields();

      // 5. calculate the budget,percentage
      updateBudget();
    }
  };

  var ctrlDeleteItem = function (event) {
    var itemId, splitId, type, id;
    itemId = event.target.parentNode.parentNode.id;
    if (itemId) {
      splitId = itemId.split("-");
      type = splitId[0];
      id = parseInt(splitId[1]);

      // 1.delete the item from the data structure
      budgetController.deleteItem(type, id);
      // 2.delete the item from the ui
      UIController.deleteListItem(itemId);
      // 3.display the remaining total value
      updateBudget();
    }
  };

  return {
    init: function () {
      setUpEventListeners();
      UIController.displayDate();
      UIController.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
      });
    },
  };
})(budgetController, UIController);

Controller.init();

console.log("Application has started");
console.log("--- :) Thiyagesh Kanna");
