function bestCharge(selectedItems) {
  /*
  * 1-获取菜品和数量
  * 2-分析菜品是否有优惠
  *   2-1 满30减6元
  *   2-2 指定菜品半价
  * 3-计算两种方式的价钱哪一种更优惠
  * 4-打印菜品名和数量
  *   打印是否参与优惠活动及省的钱数
  *   打印总价
  * */

  
  //1-获取菜品和数量
  let CountItem = [];
  function ItemCount(selectedItems) {
    let Item = [];

    selectedItems.forEach(item => {
      Item.push(item.split("x"));
    })

    Item.forEach(item => {
      item[0] = item[0].trim();
      item[1] = item[1].trim();
    })

    Item.forEach(item => {
      if (!CountItem.find(element => element.id === item[0])) {
        CountItem.push({id: item[0], count: item[1], name: "", price: 0.00, subtotal: 0.00})
      }
    })
    return selectItem(CountItem);
  }

  function selectItem(CountItem) {
    let allItem = loadAllItems();

    CountItem.forEach(item => {
      allItem.forEach(i => {
        if (item.id === i.id) {
          item.name = i.name;
          item.price = i.price;
          item.subtotal = item.count * item.price;
        }
      })
    })
    return ItemCount(selectedItems);
  }

  // 2-分析菜品是否有优惠
  // 2-1 计算菜品总价
  let summation = sumItemCount(CountItem);
  let promotions = loadPromotions();

  function sumItemCount(CountItem) {
    let sum = 0;
    CountItem.forEach(i => {
      sum += i.subtotal;
    })
    return summation;
  }

  //2-1 满30减6元
  let selectpro = selectPromotions(summation, promotions);
  let pro = [];

  function selectPromotions(summation, promotions) {

    if (summation >= 30) {
      pro.push({s_price: parseInt(summation / 30) * 6, s_name: promotions[0].type});
    } else {
      pro.push({s_price: 0, s_name: 0});
    }
    return selectpro;
  }

  //2-2 指定菜品半价
  let halfItem = [];
  let num = 0;
  let halfpro = 0;
  let halfname = [];
  promotions[1].item().forEach(i => {
    CountItem.forEach(item => {
      if (i.id = item.id) {
        num++;
        halfItem.push(item.count);
        halfpro += item.price;
        halfname.push(item.name);
      }
    })
  })

  let halfsumprice = halfPrice(halfItem, num, halfpro, promotions, halfname);
  let halfprice = [];

  function halfPrice(halfItem, num, halfpro, promotions, halfname) {

    if (num == 2) {
      halfItem.sort((a, b) => a - b)
      halfprice.push({
        s_price: halfpro * promotions[0] / 2,
        s_name: promotions[1].type + `(` + halfname[0] + `,` + halfname[1] + `)`
      });
    } else {
      halfprice.push({s_price: 0, s_name: 0});
    }
    return halfsumprice;
  }

  // 3-计算两种方式的价钱哪一种更优惠
  let moreRight = (halfprice[0].s_price > pro[0].s_price ? halfPrice : halfsumprice);

  // 3-1判断是否可以使用优惠方式
  function usepro(moreRight) {
    return moreRight[0].s_name != 0;
  }

  //4-打印菜品名和数量
    let result = expected(CountItem, morRight, summation);
    function expected(CountItem, morRight, summation) {
    let expectString = `
      ============= 订餐明细 =============\n`;
    expectString += CountItem.forEach(item => {
      item.id + ` x ` + item.count + ` = ` + item.subtotal + `元\n`
    });
    expectString +=`
      -----------------------------------\n
      ` + `使用优惠:\n`;

    if (usepro(morRight)) {
      expectString += moreRight[0].s_name + `，省` + moreRight[0].s_price + `元
       -----------------------------------
       总计：` + (summation - moreRight[0].s_price) + `元
       ===================================`.trim();
    } else {
      expectString += `总计：` + (summation) + `元
===================================`.trim();
    }
    return expectString;
  }
  return result;
}
