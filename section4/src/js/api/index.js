const BASE_URL = "http://localhost:3000/api";

const HTTP_METHOD = {
  POST (data) {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json", //json으로 통신한다는 것을 알려줌
      },
      body: JSON.stringify(data),
    }
  },
  PUT (data) {
    return {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", //json으로 통신한다는 것을 알려줌
      },
      body: JSON.stringify(data),
    }
  },
  DELETE () {
    return {
      method: "DELETE",
    }
  }
}

const request = async (url, option) => {
  const response = await fetch(url, option);

  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.log("에러가 발생했습니다.");
  }
  return response.json();
}

const requestWithoutJson = async (url, option) => {
  const response = await fetch(url, option);

  if (!response.ok) {
    alert("에러가 발생했습니다.");
    console.log("에러가 발생했습니다.");
  }
  return response;

}

export const MenuApi = {
  async getAllMenuByCategory (category) {
    //데이터를 가져올 때는 옵션 안 넣어도 됨
    // 아 이렇게 fetch들도 리팩토링 가능하구나..
    return request(`${BASE_URL}/category/${category}/menu`);
  },
  async createMenu (category, name) {
    return request(`${BASE_URL}/category/${category}/menu`, HTTP_METHOD.POST({name}));
  },
  async updateMenu (category, name, menuId) {
    return request(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.PUT({ name }));
  },
  async toggleSoldOutMenu (category, menuId) {
    return request(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, HTTP_METHOD.PUT());
  },
  async deleteMenu (category, menuId) {
    return requestWithoutJson(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.DELETE());
  }
}