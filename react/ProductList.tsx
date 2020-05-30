import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Item } from 'vtex.checkout-graphql'
import { useCssHandles } from 'vtex.css-handles'

import { ItemContextProvider } from './ItemContext'
import { AVAILABLE } from './constants/Availability'
import DepartmentGroup from './DepartmentGroup'

interface Props {
  items: Item[]
  loading: boolean
  groupByDepartment?: boolean
  onQuantityChange: (uniqueId: string, value: number, item?: Item) => void
  onRemove: (uniqueId: string, item?: Item) => void
}

const CSS_HANDLES = [
  'productListItem',
  'productListUnavailableItemsMessage',
  'productListAvailableItemsMessage',
] as const

const ProductList: StorefrontFunctionComponent<Props> = ({
  items,
  loading,
  groupByDepartment,
  onQuantityChange,
  onRemove,
  children,
}) => {
  const handles = useCssHandles(CSS_HANDLES)

  const [availableItems, unavailableItems] = items.reduce(
    (acc: any, item: Item) => {
      acc[item.availability === AVAILABLE ? 0 : 1].push(item)
      return acc
    },
    [[], []] as Item[][]
  )

  const productList = (itemList: Item[]) =>
    itemList.map((item: Item) => (
      <ItemContextProvider
        key={item.uniqueId}
        value={{
          item,
          loading,
          onQuantityChange: (value: number) =>
            onQuantityChange(item.uniqueId, value, item),
          onRemove: () => onRemove(item.uniqueId, item),
        }}
      >
        <div className={`${handles.productListItem} c-on-base bb b--muted-4`}>
          {children}
        </div>
      </ItemContextProvider>
    ))

  if (groupByDepartment) {
    const groupProducts = (itemList: any) => {
      const listDepartments: any = []
      const list: any = []
      itemList.forEach((element: any) => {
        const departmentId = parseInt(element.productCategoryIds.split('/')[1])
        let index = listDepartments.indexOf(
          element.productCategories[departmentId]
        )
        if (index == -1) {
          listDepartments.push(element.productCategories[departmentId])
          index = listDepartments.length - 1
          list[index] = {
            department: element.productCategories[departmentId],
            items: [],
          }
        }

        list[index]['items'].push(element)
      })

      return list
    }

    const groupList = (groupList: any[]) => {
      // eslint-disable-next-line no-console
      console.log('groupList', groupList)

      return groupList.map((groupItem: any, index: number) => (
        <DepartmentGroup key={index} title={groupItem.department}>
          {productList(groupItem.items)}
        </DepartmentGroup>
      ))
    }

    const availableItemsByDepartment = groupProducts(availableItems)
    const unavailableItemsByDepartment = groupProducts(unavailableItems)

    // eslint-disable-next-line no-console
    console.log(availableItemsByDepartment)
    // eslint-disable-next-line no-console
    console.log(unavailableItemsByDepartment)

    return (
      /* Replacing the outer div by a Fragment may break the layout. See PR #39. */

      <div>
        {unavailableItems.length > 0 ? (
          <div
            id="unavailable-items"
            className={`${handles.productListUnavailableItemsMessage} c-muted-1 bb b--muted-4 fw5 pv5 pl5 pl6-m pl0-l t-heading-5-l`}
          >
            <FormattedMessage
              id="store/product-list.unavailableItems"
              values={{ quantity: unavailableItems.length }}
            />
          </div>
        ) : null}
        {groupList(unavailableItemsByDepartment)}
        {unavailableItems.length > 0 && availableItems.length > 0 ? (
          <div
            className={`${handles.productListAvailableItemsMessage} c-muted-1 bb b--muted-4 fw5 mt7 pv5 pl5 pl6-m pl0-l t-heading-5-l`}
          >
            <FormattedMessage
              id="store/product-list.availableItems"
              values={{ quantity: availableItems.length }}
            />
          </div>
        ) : null}
        {groupList(availableItemsByDepartment)}
      </div>
    )
  }

  return (
    /* Replacing the outer div by a Fragment may break the layout. See PR #39. */

    <div>
      {unavailableItems.length > 0 ? (
        <div
          id="unavailable-items"
          className={`${handles.productListUnavailableItemsMessage} c-muted-1 bb b--muted-4 fw5 pv5 pl5 pl6-m pl0-l t-heading-5-l`}
        >
          <FormattedMessage
            id="store/product-list.unavailableItems"
            values={{ quantity: unavailableItems.length }}
          />
        </div>
      ) : null}
      {productList(unavailableItems)}
      {unavailableItems.length > 0 && availableItems.length > 0 ? (
        <div
          className={`${handles.productListAvailableItemsMessage} c-muted-1 bb b--muted-4 fw5 mt7 pv5 pl5 pl6-m pl0-l t-heading-5-l`}
        >
          <FormattedMessage
            id="store/product-list.availableItems"
            values={{ quantity: availableItems.length }}
          />
        </div>
      ) : null}
      {productList(availableItems)}
    </div>
  )
}

export default ProductList
