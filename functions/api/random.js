export async function onRequest({ request }) {
  const url = new URL(request.url);

  // ===== 参数 =====
  const c = url.searchParams.get("c"); // 分类（hitokoto风格）
  const encode = url.searchParams.get("encode") || "json";
  const charset = url.searchParams.get("charset") || "utf-8";
  const minLength = parseInt(url.searchParams.get("min_length") || "0");
  const maxLength = parseInt(url.searchParams.get("max_length") || "999");

  // ===== 分类映射（你可以继续扩展）=====
  const categoryMap = {
    p: ["genesis", "exodus", "leviticus", "numbers", "deuteronomy"], // 摩西五经
    g: ["matthew", "mark", "luke", "john"], // 福音书
  };

  let books = categoryMap[c] || ["genesis"]; // 默认创世记

  let allData = [];

  try {
    // ===== 加载数据 =====
    for (const book of books) {
      try {
        const res = await fetch(`${url.origin}/sentences/${book}.json`);
        if (!res.ok) continue;

        const data = await res.json();
        if (Array.isArray(data)) {
          allData = allData.concat(data);
        }
      } catch (e) {}
    }

    // fallback
    if (allData.length === 0) {
      const res = await fetch(`${url.origin}/sentences/genesis.json`);
      allData = await res.json();
    }

    // ===== 长度过滤 =====
    let filtered = allData.filter(item => {
      const len = item.length || item.bibleverses?.length || 0;
      return len >= minLength && len <= maxLength;
    });

    if (filtered.length === 0) filtered = allData;

    // ===== 随机 =====
    const random = filtered[Math.floor(Math.random() * filtered.length)];

    // ===== 兼容 hitokoto 返回字段 =====
    const result = {
      id: random.id,
      uuid: random.uuid,
      hitokoto: random.bibleverses, // ⭐关键：兼容字段
      from: random.from,
      type: random.type,
      creator: "bible",
      length: random.length || random.bibleverses.length
    };

    // ===== encode=text =====
    if (encode === "text") {
      return new Response(
        result.hitokoto + (result.from ? " —— " + result.from : ""),
        {
          headers: {
            "content-type": `text/plain; charset=${charset}`
          }
        }
      );
    }

    // ===== JSON 输出 =====
    return new Response(JSON.stringify(result), {
      headers: {
        "content-type": `application/json; charset=${charset}`
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({
      error: "服务器错误",
      detail: e.toString()
    }), {
      headers: {
        "content-type": "application/json"
      }
    });
  }
}
