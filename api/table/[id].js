import { NotionAPI } from "notion-client";
import { getNotionValue } from "../../utils";

const api = new NotionAPI({ authToken: process.env.NOTION_TOKEN || "" });

module.exports = async (req, res) => {
  const pageId = req.query.id;
  const page = await api.getPage(pageId);

  if (!page.collection) {
    return res
      .status(422)
      .json({ error: `No table found on Notion page: ${pageId}` });
  }

  const [collection] = Object.keys(page.collection).map(
    (k) => page.collection[k]
  );

  const [collectionView] = Object.keys(page.collection_view).map(
    (k) => page.collection_view[k]
  );

  const table = await api.getCollectionData(
    collection.value.id,
    collectionView.value.id
  );

  const collectionRows = collection.value.schema;
  const collectionColKeys = Object.keys(collectionRows);

  const tableArr = table.result.blockIds.map((id) => table.recordMap.block[id]);
  const tableData = tableArr.filter(
    (b) =>
      b.value && b.value.properties && b.value.parent_id === collection.value.id
  );

  const rows = [];

  for (const td of tableData) {
    let row = { id: td.value.id };

    for (const key of collectionColKeys) {
      const val = td.value.properties[key];
      if (val) {
        const schema = collectionRows[key];
        row[schema.name] = getNotionValue(val, schema.type, td);
      }
    }
    rows.push(row);
  }

  res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
  return res.json(rows);
};
