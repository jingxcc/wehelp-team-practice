function editSubscribe(){
  document.querySelector(".wrapper-2").classList.toggle('wrapper-hidden')
  document.querySelector(".wrapper-1").classList.toggle('wrapper-hidden')
}

document.querySelector(".subscribe-icon").addEventListener("click",()=>{
  document.querySelector(".main-wrapper").classList.toggle('hidden')
})

document.querySelectorAll(".fa-xmark").forEach((closeBtn)=>{
  closeBtn.addEventListener("click",()=>{
    document.querySelector(".main-wrapper").classList.toggle('hidden')
  })

})


