export async function onRequest({ request }) {
  const url = new URL(request.url);
  let book = url.searchParams.get("book") || "genesis";

  // 分类映射（核心升级）
  const categoryMap = {
    pentateuch: ["genesis", "exodus", "leviticus", "numbers", "deuteronomy"],
    gospels: ["matthew", "mark", "luke", "john"]
  };

  // 判断是否是分类
  let booksToLoad = [];

  if (categoryMap[book]) {
    booksToLoad = categoryMap[book];
  } else {
    booksToLoad = [book];
  }

  let allData = [];

  try {
    // 读取多个文件
    for (const b of booksToLoad) {
      try {
        const apiUrl = `${url.origin}/sentences/${b}.json`;
        const res = await fetch(apiUrl);

        if (!res.ok) continue;

        const data = await res.json();
        if (Array.isArray(data)) {
          allData = allData.concat(data);
        }
      } catch (e) {
        // 忽略单个文件错误
      }
    }

    // 如果没有数据，fallback 到 genesis
    if (allData.length === 0) {
      const fallback = await fetch(`${url.origin}/sentences/genesis.json`);
      allData = await fallback.json();
    }

    // 随机一句
    const random = allData[Math.floor(Math.random() * allData.length)];

    return new Response(JSON.stringify({
      book: book,
      count: allData.length,
      data: random
    }), {
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
