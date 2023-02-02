----
> **_NOTE:_** This project is out of use since Oct 7, 2021. It is archived on Jan, 02, 2023.
---

# Notion API Serverless Vercel

Copycat of https://github.com/splitbee/notion-api-worker but to deploy on vercel

## Endpoints

### Load page data

`/api/page/<PAGE_ID>`

Example ([Source Notion Page](https://www.notion.so/react-notion-example-2e22de6b770e4166be301490f6ffd420))

[`https://notion-api.mobile.club/api/page/2e22de6b770e4166be301490f6ffd420`](https://notion-api.mobile.club/api/page/2e22de6b770e4166be301490f6ffd420)

Returns all block data for a given page.
For example, you can render this data with [`react-notion`](https://github.com/splitbee/react-notion).

### Load data from table

`/api/table/<PAGE_ID>`

Example ([Source Notion Page](https://www.notion.so/splitbee/20720198ca7a4e1b92af0a007d3b45a4?v=4206debfc84541d7b4503ebc838fdf1e))

[`https://notion-api.mobile.club/api/table/20720198ca7a4e1b92af0a007d3b45a4`](https://notion-api.mobile.club/api/table/20720198ca7a4e1b92af0a007d3b45a4)
