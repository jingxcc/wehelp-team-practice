const subscribeDropDown = document.querySelector(".wrapper-1 .sub-drop-down");
const editSubscribeDropDown = document.querySelector(
  ".wrapper-2 .sub-drop-down"
);

subscribeDropDown.addEventListener("click", function (event) {
  const target = event.target;
  const selectBtn = document.querySelector(".wrapper-1 .sub-select-btn");

  if (target && target.nodeName === "LI") {
    selectBtn.textContent = target.textContent;
  }
});

editSubscribeDropDown.addEventListener("click", function (event) {
  const target = event.target;
  const selectBtn = document.querySelector(".wrapper-2 .sub-select-btn");

  if (target && target.nodeName === "LI") {
    selectBtn.textContent = target.textContent;
  }
});
