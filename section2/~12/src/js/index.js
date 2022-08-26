const $ = (selector) => document.querySelector(selector);

function App() {

  // 수정에 대해서
  // 아직 버튼이 없으니까 그 위쪽에 binding을 시켜놓는다
  // 이렇게도 해놓네? 쓸데 없는 이벤트 리스너가 호출 돼서 안 할 줄 알았는데
  // 위임
  $("#espresso-menu-list").addEventListener("click", (e) => {
    // classList로 클래스명을 배열로 가져올 수 있다
    if (e.target.classList.contains("menu-edit-button")) {
      const $menuName = e.target.closest("li").querySelector(".menu-name");
      // 2번째 인자는 디폴트 값
      // 누른 데를 기준으로 상위로 올라갔다가 찾아온다.
      // 상위 가장 가까운 li tag
      // 그 밑에 .menu-name
      const menuName = $menuName.innerText;
      const updatedMenuName = prompt("메뉴명을 수정하세요", menuName);
      $menuName.innerText = updatedMenuName;
    }
    else if (e.target.classList.contains("menu-remove-button")) {
      if (confirm("정말 삭제하시겠습니까?")) {
        // remove라는 메소드가 있다
        e.target.closest("li").remove();
        updateMenuCount();
      } else {

      }
    }
  });

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  }

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
      
    
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  $("#espresso-menu-submit-button").addEventListener("click",() => {
    addMenuName()
  });

  $("#espresso-menu-name")
    .addEventListener("keypress",
    (e) => {
      if (e.key == 'Enter') {
        addMenuName()
      }
    });
}

App();