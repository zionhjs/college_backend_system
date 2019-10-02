// 用mockjs模拟生成数据
var Mock = require('mockjs');

//node 的module.exports动态生成数据
module.exports = () => {
  // 使用 Mock 随机生成数据
  var data = Mock.mock({
    'course|227': [
      {
        // 属性 id 是一个自增数，起始值为 1，每次增 1
        'id|+1': 1000,
        question_type: '@title(5,10)',
        types: '@name',
        question_genre: '@title(6)',
        'category_Id|1-6': 1
      }
    ],
    'course_category|6': [
      {
        "id|+1": 1,
        "pid": -1,
        cName: '@ctitle(4)'
      }
    ]
  });
  // 返回的data会作为json-server的数据
  return data;
};