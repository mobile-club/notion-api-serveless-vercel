import { NowRequest, NowResponse } from '@vercel/node';

import { fetchPageById } from '../../src/notion';
import { getTableData } from '../../src/table';
import { CollectionType } from '../../src/types';
import { parsePageId } from '../../src/utils';

const notionToken = process.env.NOTION_TOKEN || '';

export default async (req: NowRequest, res: NowResponse) => {
  const pageId = parsePageId(req.query.id as string);
  const page = await fetchPageById(pageId!, notionToken);

  if (!page.recordMap.collection) {
    return res
      .status(422)
      .json({ error: `No table found on Notion page: ${pageId}` });
  }

  const collection = Object.keys(page.recordMap.collection).map(
    (k) => page.recordMap.collection[k]
  )[0];

  const collectionView: {
    value: { id: CollectionType['value']['id'] };
  } = Object.keys(page.recordMap.collection_view).map(
    (k) => page.recordMap.collection_view[k]
  )[0];

  const { rows } = await getTableData(
    collection,
    collectionView.value.id,
    notionToken
  );

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  return res.json(rows);
};
