// Window large lists with react-virtual
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useVirtual} from 'react-virtual'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

const getVirtualRowStyles = ({size, start}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: size,
  transform: `translateY(${start}px)`,
})

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  listRef,
  virtualRows,
  totalHeight,
}) {
  return (
    <ul {...getMenuProps({ref: listRef})}>
      <li style={{height: totalHeight}} />
      {virtualRows.map(({index, size, start}) => {
        const item = items[index]

        if (!item) return null

        return (
          <ListItem
            key={item.id}
            getItemProps={getItemProps}
            item={item}
            index={index}
            isSelected={selectedItem?.id === item.id}
            isHighlighted={highlightedIndex === index}
            style={getVirtualRowStyles({size, start})}
          >
            {item.name}
          </ListItem>
        )
      })}
    </ul>
  )
}

function ListItem({
  getItemProps,
  item,
  index,
  isHighlighted,
  isSelected,
  style,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
          fontWeight: isSelected ? 'bold' : 'normal',
          ...style,
        },
        ...props,
      })}
    />
  )
}

// this memoization will work because the list item is receiving only primitive values as props.
// the heavy calculation is done in the parent component (Menu) and the result is passed as a primitive value.
ListItem = React.memo(ListItem)
// ListItem = React.memo(ListItem, (prevProps, nextProps) => {
//   // this function it's deciding if the ListItem should be re-rendered or not.
//   // here we are choosing ourselfs to not re-render the ListItem if some of these props are not changing.
//   if (prevProps.getItemProps !== nextProps.getItemProps) return false
//   if (prevProps.items !== nextProps.items) return false
//   if (prevProps.index !== nextProps.index) return false
//   if (prevProps.selectedItem !== nextProps.selectItem) return false

//   if (prevProps.highlightedIndex !== nextProps.highlightedIndex) {
//     // this condition is to avoid re-rendering the ListItem if the highlightedIndex (when you mouse hover) is changing
//     const wasPrevHighlighted = prevProps.highlightedIndex === prevProps.index
//     const isNowHighlighted = nextProps.highlightedIndex === nextProps.index
//     return wasPrevHighlighted === isNowHighlighted
//   }

//   // if we got here, the ListItem should be re-rendered.
//   return true
// })

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data: items, run} = useAsync({data: [], status: 'pending'})
  React.useEffect(() => {
    run(getItems(inputValue))
  }, [inputValue, run])

  const listRef = React.useRef()

  // the estimatedSize is the size of the list of items we're going to render.
  // the overscan is how many items before and after the list we're going to render.
  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize: React.useCallback(() => 20, []),
    overscan: 10,
  })

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
    scrollIntoView: () => {}, // this is to avoid the scrollIntoView behavior of the useCombobox, because I know React will do it for me.
    onHighloghthedIndexChange: changes => {
      // this function is called when the highlightedIndex is changing.
      rowVirtualizer.scrollToIndex(changes.highlightedIndex)
    },
  })

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
          listRef={listRef}
          virtualRows={rowVirtualizer.virtualItems}
          totalHeight={rowVirtualizer.totalSize}
        />
      </div>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
*/
