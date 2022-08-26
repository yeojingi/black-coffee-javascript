import { $ } from "./utils/dom.js";
import { store } from "./store/index.js";

// 하나의 작업 단위가 작을수록 작업하기 좋다.
// 그리고 타인에게 도움을 요청하기도 좋다.
// 문장을 명확하게 써주는 것도 중요하다
// 문장을 구체적으로 적는 역량이 중요하다

// 서버로부터 데이터를 받아오는 방법
// fetch(`url`, option) 의 형태

//재사용을 위해
const BASE_URL = "http://localhost:3000/api";

// fetch(`http://localhost:3000/api`, () => {
// });

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
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
      render();
    }
    initEventListeners();
  }

  const render = () => {
    const template = this.menu[this.currentCategory].map((item, index) => {
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
    // 상태를 이용해서 개수를 센다
    // 뭐야 내가 원래 하려고 했던 거네?
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  }

  const addMenuName = async () => {
    const menuName = $("#menu-name").value;
    if (menuName === "") {
      alert("값을 입력해주세요.");
      return ;
    } 

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //json으로 통신한다는 것을 알려줌
      },
      body: JSON.stringify({ name: menuName }),
    }).then((response) => {
      return response.json(); //json화를 해준다
      // It returns a promise which resolves with the result of parsing the body text as JSON.
    })
    // data 로 json을 볼 수 있다
    // .then((data) => {
    //   console.log(data);
    // })

    /**
     * 이 밑에 fetch를 바로 붙이면 문제가 생긴다.
     * Javascript는 싱글 스레드이다
     * 
     * 카페 일을 진동벨을 받은 것
     * promise 객체
     * 진동벨이기 때문에 실행 순서대로 나오지 않을 수 있다는 것
     * 
     * 위의 fetch에 await를 추가할 수 있다
    */

    await fetch(`${BASE_URL}/category/${this.currentCategory}/menu`)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.menu[this.currentCategory] = data;
        render();
        $("#menu-name").value = "";
      });

    // this.menu[this.currentCategory].push({ name: menuName});
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    // render()로 통일
    render();
  }

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest('li').dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  }

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);

    render();
  }

  // event listener 추가를 모아놓고 init에 추가
  const initEventListeners = () => {
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

}

const app = new App();
app.init();