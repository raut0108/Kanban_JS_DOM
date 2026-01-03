import { nanoid } from "https://cdn.jsdelivr.net/npm/nanoid/nanoid.js";
const btn = document.querySelector(".add-btn");
const modal = document.querySelector(".modal-cont");
const mainCont = document.querySelector(".main-cont");
const textArea = document.querySelector(".textArea-cont");
const allColors = document.querySelectorAll(".priority-color");
const removeBtn = document.querySelector(".remove-btn");
const toolboxColors = document.querySelectorAll('.color')




let flag = false;
let delFlag = false;
let modalPriorityColor = "lightpink";
let lockClose = 'fa-lock'
let lockOpen = 'fa-lock-open'
let colors = ['lightpink','lightgreen','lightblue' ,'black']
let ticketsArr = JSON.parse(localStorage.getItem('tickets')) || []



function init(){
  if(localStorage.getItem('tickets'))
  {
     ticketsArr.forEach(function(ticket){
      createTicket(ticket.modalPriorityColor,ticket.textcontent,ticket.unqId)
     })
  }
}
init()


//Add button Event listener which will invoke the modal container
btn.addEventListener("click", function (e) {
  flag = !flag;
  if (flag) 
    {
        modal.style.display = "flex";
        allColors.forEach(function (colorEle) {
       
        colorEle.classList.remove("active");

        if(colorEle.classList.contains('lightpink'))
        {
         colorEle.classList.add("active");
         modalPriorityColor='lightpink'
        }
      
      });
    } 
      else
      {
        modal.style.display = "none";
      }
});




//Adding filters on color Selection

toolboxColors.forEach(function(selColor){

  //on single click only selected colors will be visible
  selColor.addEventListener('click' , function(){
     const selectedCol = selColor.classList[0];
     const allTicket = document.querySelectorAll('.ticket-cont')
     allTicket.forEach(function(ticket){
      const ticketColorBand = ticket.querySelector('.ticket-color')
      if(ticketColorBand.style.backgroundColor == selectedCol)
      {
        ticket.style.display = 'block'
      }
      else
      {
        ticket.style.display='none'
      }
     })

   })

   //On double click all tickets will be visible
   selColor.addEventListener('dblclick',function(e){
    const allTicket = document.querySelectorAll('.ticket-cont')
    allTicket.forEach(function(ticket){
      ticket.style.display = 'block'
    })
   })
})


//Removing Tickets from main container
removeBtn.addEventListener("click", function (e) {
  delFlag = !delFlag;
  if (delFlag == true)
  {
    alert("Delete button is activated");
    removeBtn.style.color = "red";
  }
  else
  {
    removeBtn.style.color = "white";
  }
});

function handleRemove(ticketE){
  const unqidDel = ticketE.querySelector('.ticket-id').innerText
  ticketE.addEventListener("click", function (e) 
        {
          const indexDel = getTicketIndex(unqidDel)
         if (!delFlag)
         {
           return;
         } 
         else
         {
           ticketE.remove();
         }

          if(document.querySelectorAll('.ticket-cont').length===0)
          {
           removeBtn.style.color = 'white'
           delFlag = false;
          }
          ticketsArr.splice(indexDel,1)
          updateLocalStorage(ticketsArr)
        });
}

function getTicketIndex(id)
{
  return ticketsArr.findIndex(function(ticket){
    return ticket.unqId == id
  })
}

function handleLock(ticketEdit)
{
  const lockOfTicket = ticketEdit.querySelector('.ticket-lock')
  const elementlock = lockOfTicket.children[0];
  const textOfTicket = ticketEdit.querySelector('.task-area')
  const ticketUnqID = ticketEdit.querySelector('.ticket-id').innerText
  


  elementlock.addEventListener('click',function(e){
    const index = getTicketIndex(ticketUnqID)
    if(elementlock.classList.contains(lockClose))
    {
      elementlock.classList.remove(lockClose)
      elementlock.classList.add(lockOpen)
      textOfTicket.setAttribute('contenteditable','true')
      
    }
    else
    {
      elementlock.classList.remove(lockOpen)
      elementlock.classList.add(lockClose)
      textOfTicket.setAttribute('contenteditable','false')
    }
    ticketsArr[index].textcontent = textOfTicket.innerText
    updateLocalStorage(ticketsArr)
  })
}


function handelColor(ticketCol)
{
   const colorElement = ticketCol.querySelector('.ticket-color')
   const colUnqid = ticketCol.querySelector('.ticket-id').innerText

   colorElement.addEventListener('click',function(e){
   const colIndex = getTicketIndex(colUnqid)

    let currentColor = colorElement.style.backgroundColor;
      let currentColorindx = colors.findIndex(function(col){
           return currentColor == col
      }) 
     currentColorindx++;
    let newCurrentColorIndex = currentColorindx%colors.length
    let newColor = colors[newCurrentColorIndex]
    colorElement.style.backgroundColor = newColor
    ticketsArr[colIndex].modalPriorityColor = newColor
    updateLocalStorage(ticketsArr)
   })
   
   
}
    

//Creating ticket function which will invoke when modal will have event
function createTicket(ticketColor, text, id) {
  const ticketCont = document.createElement("div");
  ticketCont.setAttribute("class", "ticket-cont");
  ticketCont.innerHTML = `
    <div class="ticket-color" style="background-color:${ticketColor}"></div>
    <div class="ticket-id">${id}</div>
    <div class="task-area">${text}</div>
    <div class="ticket-lock">
        <i class="fa-solid fa-lock"></i>
    </div>
    `;
  mainCont.appendChild(ticketCont);
  handleRemove(ticketCont)
  handleLock(ticketCont)
  handelColor(ticketCont)
}

// Modal container Event Listener
modal.addEventListener("keydown", function (e) {
  const key = e.key;
  if (key === "Enter" ) {
    /*
        Manual id Generation but it is not Recommended
        //36 is radix value ,in js minimum radix is 2 and max is 36 
        const id = Math.random().toString(36).subString(2,8)
        
        We can use Short ID library but It is Deprecated now tha's 
        why we used Nano ID
        
        <!-- Load shortid from CDN to HTML file-->
        <script src="https://cdn.jsdelivr.net/npm/shortid/dist/shortid.min.js"></script>
        deprecated link :- https://cdn.jsdelivr.net/npm/shortid/dist/shortid.min.js
        working link(shortid):-https://unpkg.com/shortid-dist@1.0.5/dist/shortid-2.2.13.min.js 
        
        And use it directlly in js file
        const id1 = shortid.generate();
     */

    const unqId = "Ticket ID : " + nanoid(5);
    const textcontent = textArea.value;
    createTicket(modalPriorityColor, textcontent, unqId);
    modal.style.display = "none";
    textArea.value = "";
    flag = false;
    ticketsArr.push({textcontent,unqId,modalPriorityColor})
    updateLocalStorage()
  }
});

//Functionality to change the active class on the  basis of selection
// in modal while creating ticket
allColors.forEach(function parent(color) {
  color.addEventListener("click", function child(e) {
    // Removing active class from all priority color div's
    allColors.forEach(function (priorityElement) {
      priorityElement.classList.remove("active");
    });

    //Adding active class to selected priority-color  div
    color.classList.add("active");
    modalPriorityColor = color.classList[0];
  });
});



function updateLocalStorage(){
     localStorage.setItem('tickets',JSON.stringify(ticketsArr))
}
