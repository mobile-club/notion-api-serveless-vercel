/* eslint no-loop-func: off */
import { NowRequest, NowResponse } from '@vercel/node';

import { parsePageId } from '../../src/utils';
import { fetchBlocks, fetchPageById } from '../../src/notion';
import { BlockType } from '../../src/types';
import { getTableData } from '../../src/table';

const notionToken = process.env.NOTION_TOKEN || '';

export default async (req: NowRequest, res: NowResponse) => {
  const pageId = parsePageId(req.query.id as string);
  const page = await fetchPageById(pageId!, notionToken);

  const baseBlocks = page.recordMap.block;

  let allBlocks: { [id: string]: BlockType & { collection?: any } } = {
    ...baseBlocks,
  };
  let allBlockKeys;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    allBlockKeys = Object.keys(allBlocks);

    const pendingBlocks = allBlockKeys.flatMap((blockId) => {
      const block = allBlocks[blockId];
      const content = block.value && block.value.content;

      return content && block.value.type !== 'page'
        ? content.filter((id: string) => !allBlocks[id])
        : [];
    });

    if (!pendingBlocks.length) {
      break;
    }

    const newBlocks = await fetchBlocks(pendingBlocks).then(
      (res2) => res2.recordMap.block
    );

    allBlocks = { ...allBlocks, ...newBlocks };
  }

  const collection = page.recordMap.collection
    ? page.recordMap.collection[Object.keys(page.recordMap.collection)[0]]
    : null;

  const collectionView = page.recordMap.collection_view
    ? page.recordMap.collection_view[
        Object.keys(page.recordMap.collection_view)[0]
      ]
    : null;

  if (collection && collectionView) {
    const pendingCollections = allBlockKeys.flatMap((blockId) => {
      const block = allBlocks[blockId];

      return block.value.type === 'collection_view' ? [block.value.id] : [];
    });

    for (const b of pendingCollections) {
      const { rows, schema } = await getTableData(
        collection,
        collectionView.value.id,
        notionToken,
        true
      );

      const viewIds = (allBlocks[b] as any).value.view_ids as string[];

      allBlocks[b] = {
        ...allBlocks[b],
        collection: {
          title: collection.value.name,
          schema,
          types: viewIds.map((id) => {
            const col = page.recordMap.collection_view[id];
            return col ? col.value : undefined;
          }),
          data: rows,
        },
      };
    }
  }

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  return res.json(allBlocks);
};
