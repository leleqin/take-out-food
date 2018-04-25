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

  let num = 0;
  let promotionsItem = [];
  let promotionsPrice = 0;
  let name = [];
  let countItem = statisticalGoods(selectedItems)
  let promotions = loadPromotions();
  let summation = summationFunction(countItem);
  let difference = differenceFunction(summation, promotions);


  //2-2 指定菜品半价
  promotions[1].items.forEach(item => {
    countItem.forEach(data => {
      if (item == data.id) {
        num++;
        promotionsItem.push(data.count)
        promotionsPrice += data.price;
        name.push(data.name)
      }
    })
  })

  // 3-计算两种方式的价钱哪一种更优惠
  let halfPrice = halfPriceFunction(promotionsItem, num, promotionsPrice, promotions, name);
  let maximumDiscount = (difference[0].m_price > halfPrice[0].m_price ? difference : halfPrice);
  let expectedResult = expected(countItem, maximumDiscount, summation);

  return expectedResult
}


//1-获取菜品和数量
function statisticalGoods(selectedItems,) {
  let array_key = [];
  let countItem = [];

  selectedItems.forEach(item => {
    array_key.push(item.split("x"))
  })
  array_key.forEach(data => {
    data[0] = data[0].trim();
    data[1] = data[1].trim();
  })
  array_key.forEach(data => {
    if (!countItem.find(element => element.id === data[0])) {
      countItem.push({id: data[0], count: data[1], name: '', price: 0.00, subtotal: 0.00})
    }
  })
  return statisticalCommodityMachine(countItem);
}

function statisticalCommodityMachine(countItem) {
  let allItems = loadAllItems();

  countItem.forEach(item => {
    allItems.forEach(data => {
      if (item.id === data.id) {
        item.name = data.name;
        item.price = data.price;
        item.subtotal = (item.price) * item.count;
      }
    })
  })

  return countItem
}

// 2-分析菜品是否有优惠
// 2-1 计算菜品总价
function summationFunction(countItem) {
  let summation = 0;
  countItem.forEach(data => {
    summation += data.subtotal
  })
  return summation;
}

//2-1 满30减6元
function differenceFunction(summation, promotions) {
  let difference = [];
  if (summation >= 30) {
    difference.push({m_price: parseInt(summation / 30) * 6, m_name: promotions[0].type});
  } else {
    difference.push({m_price: 0, m_name: 0});

  }
  return difference
}

function halfPriceFunction(promotionsItem, num, promotionsPrice, promotions, name) {
  let halfPrice = [];
  if (num == 2) {
    promotionsItem.sort((a, b) => a - b)
    halfPrice.push({
      m_price: promotionsPrice * promotionsItem[0] / 2,
      m_name: promotions[1].type + `(` + name[0] + `，` + name[1] + `)`
    });
  } else {
    halfPrice.push({
      m_price: 0,
      m_name: 0
    });
  }
  return halfPrice;
}

// 3-1判断是否可以使用优惠方式
function isShangFavorable(maximumDiscount) {
  return maximumDiscount[0].m_name !== 0;
}

//4-打印菜品名和数量
function expected(countItem, maximumDiscount, summation) {
  let expectedString = "";

  expectedString += `============= 订餐明细 =============\n`;
  countItem.forEach(item => {
    expectedString += item.name + ` x ` + item.count + ` = ` + item.subtotal + `元\n`
  })
  expectedString += `-----------------------------------\n`;

  if (isShangFavorable(maximumDiscount)) {
    expectedString += `使用优惠:
` + maximumDiscount[0].m_name + `，省` + maximumDiscount[0].m_price + `元
-----------------------------------
总计：` + (summation - maximumDiscount[0].m_price) + `元
===================================`.trim();
  } else {
    expectedString += `总计：` + (summation) + `元
===================================`.trim();
  }

  return expectedString
}

