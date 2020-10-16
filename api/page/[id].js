import { NotionAPI } from "notion-client";

const api = new NotionAPI({ authToken: process.env.NOTION_TOKEN || "" });

module.exports = async (req, res) => {
  const pageId = req.query.id;
  const page = await api.getPage(pageId, { fetchCollections: true });
  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  return res.json(page.block);
};
