//savaToLocal(this.seller.id, 'favorite', this.favorite);存取
export function saveToLocal(id, key, value) { //存储到localStorge
    let seller = window.localStorage.__seller__;
    if (!seller) { //没有seller的时候，初始化，定义一个seller对象，并给他设定一个id
      seller = {};
      seller[id] = {}; // 每个id下都是一个单独的obj
    } else {
      seller = JSON.parse(seller); // JSON 字符串转换为对象
      if (!seller[id]) { //判断是否有当前这个商家
        seller[id] = {};
      }
    }
    seller[id][key] = value; // 将key和value存到id这个对象的下边
    window.localStorage.__seller__ = JSON.stringify(seller); //将一个JavaScript值(对象或者数组)转换为一个 JSON字符串
  }


  //loadFromlLocal(this.seller.id, 'favorite', false);读取
  export function loadFromlLocal(id, key, def) { //读取，读不到的时候传入一个default变量
    let seller = window.localStorage.__seller__;
    if (!seller) {
      return def;
    }
    seller = JSON.parse(seller)[id]; // 取到这个商家下所有的对象
    if (!seller) {
      return def;
    }
    let ret = seller[key];
    return ret || def;
  }
  