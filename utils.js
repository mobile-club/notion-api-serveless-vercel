// taken from https://github.com/splitbee/notion-api-worker/blob/master/src/api/utils.ts

const getTextContent = (text) => {
  return text.reduce((prev, current) => prev + current[0], "");
};

export const getNotionValue = (val, type, row) => {
  switch (type) {
    case "text":
      return getTextContent(val);
    case "person":
      return val.filter((v) => v.length > 1).map((v) => v[1][0][1]) || [];
    case "checkbox":
      return val[0][0] === "Yes";
    case "date":
      if (val[0][1][0][0] === "d") return val[0][1][0][1].start_date;
      else return "";
    case "title":
      return getTextContent(val);
    case "select":
      return val[0][0];
    case "multi_select":
      return val[0][0].split(",");
    case "number":
      return Number(val[0][0]);
    case "relation":
      return val
        .filter(([symbol]) => symbol === "‣")
        .map(([_, relation]) => relation[0][1]);
    case "file":
      return val
        .filter((v) => v.length > 1)
        .map((v) => {
          const rawUrl = v[1][0][1];

          const url = new URL(
            `https://www.notion.so${
              rawUrl.startsWith("/image")
                ? rawUrl
                : `/image/${encodeURIComponent(rawUrl)}`
            }`
          );

          url.searchParams.set("table", "block");
          url.searchParams.set("id", row.value.id);
          url.searchParams.set("cache", "v2");

          return { name: v[0], url: url.toString(), rawUrl };
        });
    default:
      console.log({ val, type });
      return "Not supported";
  }
};
