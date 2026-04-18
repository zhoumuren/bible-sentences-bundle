export async function onRequest({ request }) {
  const url = new URL(request.url);

  // 👉 参数（兼容 hitokoto 风格）
  const book = url.searchParams.get("book");   // 单卷
  const c = url.searchParams.get("c");         // 分类（类似 hitokoto）
  const encode = url.searchParams.get("encode"); // text / json

  // 👉 分类映射
  const categoryMap = {
    p: ["genesis", "exodus", "leviticus", "numbers", "deuteronomy"], // 摩西五经
    g: ["matthew", "mark", "luke", "john"], // 福音书
  };

  let booksToLoad = [];

  if (c && categoryMap[c]) {
    booksToLoad = categoryMap[c];
  } else if (book) {
    booksToLoad = [book];
  } else {
    booksToLoad = ["genesis"]; // 默认
  }

  let allData = [];

  try {
    // 👉 加载多个 JSON
    for (const b of booksToLoad) {
      try {
        const res = await fetch(`${url.origin}/sentences/${b}.json`);
        if (!res.ok) continue;

        const data = await res.json();
        if (Array.isArray(data)) {
          allData = allData.concat(data);
        }
      } catch (e) {
        // 忽略单个错误
      }
    }

    // 👉 fallback
    if (allData.length === 0) {
      const res = await fetch(`${url.origin}/sentences/genesis.json`);
      allData = await res.json();
    }

    // 👉 随机
    const random = allData[Math.floor(Math.random() * allData.length)];

    // 👉 encode=text（完全模仿 hitokoto）
    if (encode === "text") {
      return new Response(
        random.bibleverses + (random.from ? " —— " + random.from : ""),
        {
          headers: { "content-type": "text/plain; charset=utf-8" }
        }
      );
    }

    // 👉 默认 JSON（扁平结构）
    return new Response(JSON.stringify(random), {
      headers: {
        "content-type": "application/json"
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({
      error: "系统错误",
      detail: e.toString()
    }), {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
