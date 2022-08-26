const $ = (selector) => document.querySelector(selector);

// 실행되어야 하니까 App을 만든다
function App() {
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });


  // 메뉴의 이름을 입력받는 건
  $("#espresso-menu-name")
    .addEventListener("keypress",
    (e) => {
      if (e.key == 'Enter') {
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
        // const 변수 = li 갯수를 카운팅 해서
        // class와 일치시켜서 변수명을 고르면 좋다. 이미 만들어진 변수명들을 참고하면 좋다.
        const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
        $(".menu-count").innerText = `총 ${menuCount}개`;
        $("#espresso-menu-name").value = "";
      }
    });
}

App();