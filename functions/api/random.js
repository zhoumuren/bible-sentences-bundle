export async function onRequest({ request }) {
  const url = new URL(request.url);

  // 获取参数
  const category = url.searchParams.get("c");

  // 你的分类（目前是 a-l）
  const categories = ["a","b","c","d","e","f","g","h","i","j","k","l"];

  // 随机分类
  const key = category || categories[Math.floor(Math.random() * categories.length)];

  // 拼接 JSON 地址
  const apiUrl = `https://bibleverses.mentu.faith/sentences/${key}.json`;

  // 获取数据
  const res = await fetch(apiUrl);
  const data = await res.json();

  // 随机一句
  const random = data[Math.floor(Math.random() * data.length)];

  return new Response(JSON.stringify({
    category: key,
    data: random
  }), {
    headers: {
      "content-type": "application/json"
    }
  });
}
