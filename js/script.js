// FAQ

const questions=document.querySelectorAll(".faq-question");

questions.forEach(btn=>{

btn.addEventListener("click",()=>{

const answer=btn.nextElementSibling;

if(answer.style.display==="block"){

answer.style.display="none";

btn.querySelector("span").innerHTML="+";

}else{

answer.style.display="block";

btn.querySelector("span").innerHTML="-";

}

});

});