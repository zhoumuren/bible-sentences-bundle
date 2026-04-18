export async function onRequest({ request }) {
  const url = new URL(request.url);

  // ⭐ 支持 ?type=xxx
  const type = url.searchParams.get("type");

  // ⭐ 所有分类（与你仓库一致）
  const categories = [
    "acts",
    "general_epistles",
    "gospels",
    "historical",
    "major_prophets",
    "minor_prophets",
    "pauline_epistles",
    "pentateuch",
    "revelation",
    "wisdom"
  ];

  try {
    // ===== 1️⃣ 确定使用哪个分类 =====
    let selectedCategory;

    if (type && categories.includes(type)) {
      selectedCategory = type; // 指定分类
    } else {
      selectedCategory = categories[Math.floor(Math.random() * categories.length)]; // 随机分类
    }

    // ===== 2️⃣ 加载 JSON =====
    const res = await fetch(`${url.origin}/sentences/${selectedCategory}.json`);
    if (!res.ok) {
      throw new Error("JSON 文件加载失败: " + selectedCategory);
    }

    const data = await res.json();

    // ===== 3️⃣ 随机一条 =====
    const random = data[Math.floor(Math.random() * data.length)];

    // ===== 4️⃣ 标准输出（你的API规范） =====
    const result = {
      bibleverses: random.bibleverses,
      reference: random.from,
      category: selectedCategory
    };

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json"
      }
    });

  } catch (e) {
    return new Response(JSON.stringify({
      error: "加载失败",
      detail: e.toString()
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
