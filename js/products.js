const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      api_url: "https://vue3-course-api.hexschool.io/v2",
      api_path: "letcla",
      temp: {},
      numVal: 0,
      showErr: false,
      del: false,
      errTitle: "",
      delSuccess: true,
      isLoading: false,
      products: [],
    };
  },
  methods: {
    // 切換商品圖片
    changeImg(e) {
      this.temp.imageUrl = e.target.currentSrc;
    },
    // 切換商品時數量歸 0
    clearVal(temp) {
      this.numVal = 0;
    },
    // 增加數量
    add(temp) {
      this.numVal++;
      if (this.numVal > temp.num) {
        this.numVal = temp.num;
      }
    },
    // 減少數量
    min() {
      this.numVal--;
      if (this.numVal < 0) {
        this.numVal = 0;
      }
    },
    // 驗證 token
    checkLogin() {
      axios
        .post(`${this.api_url}/api/user/check`)
        .then((res) => {
          this.getData();
        })
        .catch((err) => {
          this.isLoading = false;
          // 驗證失敗跳出 modal 訊息
          this.showErr = true;
          this.errTitle = err.response.data.message;
        });
    },
    // 取得商品
    getData() {
      axios
        .get(`${this.api_url}/api/${this.api_path}/admin/products`)
        .then((res) => {
          this.isLoading = false;
          this.products = res.data.products;
          // 將 imageUrl 增加到 imagesUrl 陣列的第一張
          this.products.forEach((item) => {
            const newImages = item.imagesUrl.unshift(item.imageUrl);
          });
        })
        .catch((err) => {
          this.isLoading = false;
          console.dir(err);
        });
    },
    // 刪除商品
    delProdBtn(prodId) {
      this.isLoading = true;
      axios
        .delete(`${this.api_url}/api/${this.api_path}/admin/product/${prodId}`)
        .then((res) => {
          this.isLoading = false;
          // 跳出成功 modal 訊息
          this.del = true;
          this.delSuccess = res.data.success;
          this.errTitle = res.data.message;

          // 重新取得商品資料
          this.getData();
          this.temp = this.products;
        })
        .catch((err) => {
          this.isLoading = false;
          // 跳出失敗 modal 訊息
          this.del = true;
          this.delSuccess = err.response.data.success;
          this.errTitle = err.response.data.message;
        });
    },
    // 關閉驗證失敗 modal 訊息，並重新導回登入頁
    closeErr() {
      this.showErr = false;
      window.location = "login.html";
    },
    closeDel() {
      this.del = false;
    },
  },
  created() {
    this.isLoading = true;
    // 取得 token
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    axios.defaults.headers.common["Authorization"] = token;
    this.checkLogin();
  },
})
  .use(VueLoading.Plugin)
  .component("loading", VueLoading.Component)
  .mount("#app");
