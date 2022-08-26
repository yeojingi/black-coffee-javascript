import { $ } from "./utils/dom.js";
import { store } from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";


const MenuApi = {
  async getAllMenuByCategory (category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);

    return response.json();
  },
  async createMenu (category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //json으로 통신한다는 것을 알려줌
      },
      body: JSON.stringify({ name }),
    })
    
    // 성공한 응답인지 아닌지가 중요하다
    // ok를 통해 알 수 있다
    if (!response.ok) {
      console.log("에러가 발생했습니다");
    }
  },
  async updateMenu (category, name, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json", //json으로 통신한다는 것을 알려줌
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      console.log("에러가 발생했습니다");
    }

    return response.json();
  },
  async toggleSoldOutMenu (category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
    {
      method: "PUT",
    });

    if (!response.ok) {
      console.log("에러가 발생했습니다");
    }
  },
  async deleteMenu (category, menuId) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`,
    {
      method: "DELETE",
    });

    if (!response.ok) {
      console.log("에러가 발생했습니다");
    }
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
  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    initEventListeners();
  }

  const render = () => {
    const template = this.menu[this.currentCategory].map((item, index) => {
      return `
        <li data-menu-id="${item.id}" class="menu-list-item d-flex items-center py-2">
          <span class="${
            item.isSoldOut ? "sold-out" : ""
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
    const menuCount = this.menu[this.currentCategory].length;
    $(".menu-count").innerText = `총 ${menuCount}개`;
  }

  const addMenuName = async () => {
    const menuName = $("#menu-name").value;
    if (menuName === "") {
      alert("값을 입력해주세요.");
      return ;
    } 

    await MenuApi.createMenu(this.currentCategory, menuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
    $("#menu-name").value = "";

    // this.menu[this.currentCategory].push({ name: menuName});
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest('li').dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    render();
  }

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest('li').dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
      // this.menu[this.currentCategory].splice(menuId, 1);
      // store.setLocalStorage(this.menu);
      render();
    }
  }

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
    // this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut;
    // store.setLocalStorage(this.menu);

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
  
    $("nav").addEventListener("click", async (e) => {
      const isCategoryButton = e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        // 매번 불러오는 거에 별 문제가 없나 보네..?
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(this.currentCategory);
        render();
      }
    });

  }

}

const app = new App();
app.init();