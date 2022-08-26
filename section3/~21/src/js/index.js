const $ = (selector) => document.querySelector(selector);

// localStorage에 접근하는 개체
const store = {
  setLocalStorage(menu) {
    // 객체로 넘겨줄 수 없으니 JSON.stringify 로 문자열로 넘겨준다
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  }
}

function App() {
  // 상태를 관리해보자 (상태 = 변할 수 있는 데이터)
  // 이 앱의 상태를 찾아보자
  //  개수, 메뉴명
  //  개수는 메뉴명에 의존적
  // 그러므로, '메뉴명'을 관리한다
  // 관리해야할 필요가 없는 데이터도 상태로 관리하면 복잡해질 수 있다

  // 상태값 선언, 초
  this.menu = [];

  // localStorage 읽어오기
  this.init = () => {
    if (store.getLocalStorage().length > 1) {
      this.menu = store.getLocalStorage();
      render();
    }
  }

  const render = () => {
    const template = this.menu.map((item, index) => {
      // data-menu-id 는 menu-id라는 변수를 임의로 추가해줄 수 있는 것이다
      return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="w-100 pl-2 menu-name">${item.name}</span>
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
      `}).join('');
    
    updateMenuCount();

    $("#espresso-menu-list").innerHTML = template;
  }

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

    this.menu.push({ name: espressoMenuName});
    store.setLocalStorage(this.menu);
    render();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    // 부여한 데이터는 이와 같이 접근할 수 있다.
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[menuId].name = updatedMenuName;
    // localStorage로 직접 접근하면, 데이터 접근을 여려 군데로 분산시키게 된다.
    // 그러면 함수의 역할이 불분명해지게 됨
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  }

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest('li').dataset.menuId;
      // splice로 삭제 
      this.menu.splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  }

  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
    }
    else if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  $("#espresso-menu-name").addEventListener("keypress",
    (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      addMenuName()
    });
}

// new 키워드를 사용하여 생성자 함수를 호출하게 되면 이때의 this는 "만들어질 객체"를 참조한다.
// 아래 선언을 App()으로만 만들면
// Cannot set properties of undefined 라는 에러가 나옴
const app = new App();
// 생성 시 벌어질 일을 실행한다.
app.init();