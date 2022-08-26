const $ = (selector) => document.querySelector(selector);

// 실행되어야 하니까 App을 만든다
function App() {
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  // 함수명을 고를 때 일단 던져보고 어울리는지 확인하면 된다
  const addMenuName = () => {
    const espressoMenuName = $("#espresso-menu-name").value;

    if (espressoMenuName === "") {
      alert("값을 입력해주세요.");
      return ;
    } 
    const menuItemTemplate = (espressoMenuName) => {
      return `
      <li class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
        >
          수정
        </button>
        <button
          type="button"
          class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
        >
          삭제
        </button>
      </li>
    `};
    $("#espresso-menu-list")
      .insertAdjacentHTML(
        "beforeend",
        menuItemTemplate(espressoMenuName)
      );
      
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
    $("#espresso-menu-name").value = "";
  };

  $("#espresso-menu-submit-button").addEventListener("click",() => {
    addMenuName()
  });

  // 메뉴의 이름을 입력받는 건
  $("#espresso-menu-name")
    .addEventListener("keypress",
    (e) => {
      if (e.key == 'Enter') {
        addMenuName()
      }
    });
}

App();