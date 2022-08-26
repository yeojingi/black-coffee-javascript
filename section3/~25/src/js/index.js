// index.html 에 category-title 추가했다
// 그리고 espressso 라는 이름도 수정했음

const $ = (selector) => document.querySelector(selector);

const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  }
}

function App() {
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };
  this.currentCategory = 'espresso';
  this.init = () => {
    // store.getLocalStorage()가 존재하면서 길이가 1 초과일 때
    // store.getLocalStorage()가 존재하지 않으면 아예 length를 찍어볼 수가 없다
    // if (store.getLocalStorage() && store.getLocalStorage().length > 1) {
    if (store.getLocalStorage()) {
      // 와 모듈화 장난아니네..
      // 그냥 위에 menu만 바꿔주고 여기는 건드리지도 않음
      this.menu = store.getLocalStorage();
      render();
    }
  }

  const render = () => {
    const template = this.menu[this.currentCategory].map((item, index) => {
      // class에 삼항 연산자를 넣음으로써
      return `
        <li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
          <span class="${
            item.soldOut ? "sold-out" : ""
          } w-100 pl-2 menu-name">${item.name}</span>
          <button
            type="button"
            class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
          >
            품절
          </button>
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

    $("#menu-list").innerHTML = template;
  }

  const updateMenuCount = () => {
    const menuCount = $("#menu-list").querySelectorAll("li").length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  }

  const addMenuName = () => {
    const menuName = $("#menu-name").value;
    if (menuName === "") {
      alert("값을 입력해주세요.");
      return ;
    } 

    this.menu[this.currentCategory].push({ name: menuName});
    store.setLocalStorage(this.menu);
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  }

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest('li').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      updateMenuCount();
    }
  }

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);

    render();
  }

  $("#menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      updateMenuName(e);
      // if 문이 여러 개 있을 때 return을 해버리면 좋은 습관이다.
      return;
    }
    else if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
      return;
    }

    if (e.target.classList.contains("menu-sold-out-button")) {
      soldOutMenu(e);
      return;
    }
  });

  $("#menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#menu-submit-button").addEventListener("click", addMenuName);

  $("#menu-name").addEventListener("keypress",
    (e) => {
      if (e.key !== 'Enter') {
        return;
      }
      addMenuName()
    });

  // button 마다 달아주는 게 비효율적이니까 상위 태그에 이벤트를 달아보자.
  $("nav").addEventListener("click", (e) => {
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  });
}

// new 를 하면 각각이 다른 상태를 가질 수 있게 된다. (인스턴스를 만든다는 것)
// new 를 안 쓰면 하나의 함수만 존재한다.
// web application의 기본이 상태 관리다.
// 사용자의 인터랙션을 위한 것. 상태 관리가 잘 되어야 동적인 웹페이지를 만들 수 있다.
const app = new App();
app.init();