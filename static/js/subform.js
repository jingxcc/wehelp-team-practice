let userSelectValue;

function selectOpt(){
  const opts=document.querySelectorAll(".opt")
  opts.forEach((opt)=>{
    opt.addEventListener('click',()=>{
      userSelectValue=opt.innerHTML
      document.querySelector('.user-location').innerHTML=userSelectValue
    })
  })
}
selectOpt();

function getUserData(){
  if(document.querySelector('.user-input').value=="" || document.querySelector('.user-location').innerHTML==""){
    alert('請輸入內容')
  }else{
    console.log(document.querySelector('.user-input').value)
    console.log(document.querySelector('.user-location').innerHTML)
    alert('成功')
  }
}


