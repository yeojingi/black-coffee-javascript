// step1 요구사항 구현을 위한 전략

/**
 * 무엇을 먼저 구현해야 좋을까? (의존성 파악)
 * 한 문장에 두 가지 구현 사항이 있으면 쪼갠다
 
 * 먼저 개발하지 말고, 지도를 먼저 그려야 한다.
 */

// 줄여쓰기
// 관용적으로 $를 씀
const $ = (selector) => document.querySelector(selector);

// 실행되어야 하니까 App을 만든다
function App() {
  // form tag가 자동 전송되는 것을 막는다
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });


  // 메뉴의 이름을 입력받는 건
  $("#espresso-menu-name")
    .addEventListener("keypress",
    (e) => {
      // Enter를 그대로 쓰네?
      // Enter를 치면 새로고침 됨. form tag가 기본 제공하는 기능
      if (e.key == 'Enter') {
        const espressoMenuName = $("#espresso-menu-name").value;
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
        // 이거 말고, insertAdjacentHTML도 있다
        // $("#espresso-menu-list").innerHTML += menuItemTemplate(espressoMenuName);
        $("#espresso-menu-list").insertAdjacentHTML("beforeend", menuItemTemplate(espressoMenuName));
      }
    }); 
}

App();