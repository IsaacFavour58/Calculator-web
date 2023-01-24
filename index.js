const initApp = () => {
    const currentvalueElem = document.querySelector(".currentvalue")
    const previousvalueElem = document.querySelector(".previousvalue")
    const inputEl = document.getElementById("inputs")
    const historyEl = document.querySelector("p");
    console.log(historyEl);
    const btnEl = document.getElementById("btn1")
//console.log(inputEl);
//console.log(historyEl);

    let itemArray = [];
    const equationArray = [];
    let newNumberFlag = false;

   

    const inputButtons = document.querySelectorAll(".number");
    inputButtons.forEach(button => {
        button.addEventListener("click", (event) =>{

            const newInput = event.target.textContent;
            if(newNumberFlag){
              currentvalueElem.value = newInput;  
              newNumberFlag = false
            }else{
                currentvalueElem.value = 
                currentvalueElem.value == 0
                ? newInput
                : `${currentvalueElem.value}${newInput}`
            }
        });
    });
    const opbuttons = document.querySelectorAll(".operator");
    opbuttons.forEach(button => {
        button.addEventListener("click", (event) => {
            //equal sign showing
            if(newNumberFlag){
                previousvalueElem.textContent = "";
                itemArray = [];

            }
            const newoperator = event.target.textContent
            const currentvalue = currentvalueElem.value;

            //need number first
            if(itemArray.length && currentvalue == 0) return;
              
            //begin a new equation
            if (!itemArray.length) {
                itemArray.push(currentvalue, newoperator);
                previousvalueElem.textContent = 
                `${currentvalue} ${newoperator}`
            
                previousvalueElem.textContent = 
                `${currentvalue}
                 ${newoperator}`
                return newNumberFlag = true;

            }
            //complete an equation
            if(itemArray.length){
                itemArray.push(currentvalue); //3red Elem
                const equationobj = {
                    num1: parseFloat(itemArray[0]),
                    num2: parseFloat(currentvalue),
                    op: itemArray[1]

                }
                equationArray.push(equationobj);
                const equationstring = 
                `${equationobj['num1']}
                ${equationobj['op']}
                ${equationobj['num2']}`;
                const newvalue = calculate(equationstring, currentvalueElem);
                
                 previousvalueElem.textContent =
                 `${newvalue} ${newoperator}`;
                 
                 //start a new equation
                itemArray = [newvalue, newoperator];
                 newNumberFlag = true;
                 console.log(equationArray);
            }
        }); 

    });

    btnEl.addEventListener("click", () =>{
        historyView()
        if (historyEl.className === 'history') {
            classList.add('active');
            console.log({ans: true, historyEl});
        }
     });
     localStorage.setItem('value', JSON.stringify(historyEl));
     JSON.parse(localStorage.getItem("value"))
 

     function historyView() {
         historyEl.innerHTML += `${equationArray[0].num1}
          ${equationArray[0].op} ${equationArray[0].num2} = ${inputEl.value} <br/>`

    //     if (historyEl.className === 'history') {
    //         classList.add('active')
    //         console.log({ans: true, historyEl});
    // }
        
     }


    const equalsbutton = document.querySelector(".equals");
    equalsbutton.addEventListener("click" , () =>{
        const currentvalue = currentvalueElem.value
        let equationobj;
        //pressing equals repeatedly
         if(!itemArray.length && equationArray.length){
            const lastEquation = equationArray[equationArray.length - 1];
         equationobj = {
            num1: parseFloat(currentvalue),
            num2: lastEquation.num2,
            op: lastEquation.op
         }
        }else if(!itemArray.length){
            return currentvalue;
        }else {itemArray.push(currentvalue);
            equationobj = {
                num1: parseFloat(itemArray[0]),
                num2: parseFloat(currentvalue),
                op: itemArray[1]
            }
            
        }
        equationArray.push(equationobj)
        const equationstring = `${equationobj['num1']} ${equationobj['op']} ${equationobj['num2']}`;

        calculate(equationstring, currentvalueElem);
        previousvalueElem.textContent = `${equationstring} =`;

        newNumberFlag = true;
        itemArray = [];
        console.log(equationArray);

    })

    const clearButtons = document.querySelectorAll(".clear, .clearEntry");
    clearButtons.forEach(button => {
      button.addEventListener("click", () =>{
        currentvalueElem.value = 0;
        if  (event.target.classList.contains("clear")) {
            previousvalueElem.textContent = "";
           itemArray = []
        }
        

      }); 
    });
    const deleteButton = document.querySelector(".delete");
    deleteButton.addEventListener("click", () => {
        currentvalueElem.value = currentvalueElem.value.slice(0, -1);
    });
    const signChangeButton = document.querySelector(".signchange");
    signChangeButton.addEventListener("click", () => {
        currentvalueElem.value = parseFloat(currentvalueElem.value) * -1;

    })

}

document.addEventListener("DOMContentLoaded", initApp)


const calculate = (equation, currentvalueElem) => {
const regex = /(^[*/=])|(\s)/g;
 equation.replace(regex, '');
 const divByZero = /(\/0)/.test(equation);
    if (divByZero) return currentvalueElem.value = 0;
    return currentvalueElem.value = eval(equation);
}
