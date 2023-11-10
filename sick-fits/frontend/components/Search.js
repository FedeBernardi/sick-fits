import { resetIdCounter, useCombobox } from 'downshift';
import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/dist/client/router';
import { SearchStyles, DropDown, DropDownItem } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchTerms: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  // takes care of any serverside rendering error that could
  // popup in the console
  resetIdCounter();
  const router = useRouter();

  const [findItems, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    { fetchPolicy: 'no-cache' }
  );
  console.log({ loading, data, error });
  let items = data?.searchTerms || [];
  const findItemsButChill = debounce(findItems, 350);

  const {
    isOpen,
    inputValue,
    getMenuProps,
    getInputProps,
    getItemProps,
    getComboboxProps,
    highlightedIndex,
    setInputValue,
  } = useCombobox({
    items,
    onInputValueChange() {
      console.log('ionput changed', inputValue);
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        router.push({
          pathname: `/product/${selectedItem.id}`,
        });
        setInputValue('');
        items = [];
      }
    },
    itemToString: () => '',
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            placeholder: 'Search for an item',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {items.map((item, i) => (
          <DropDownItem
            key={item.id}
            {...getItemProps({ item })}
            highlighted={i === highlightedIndex}
          >
            <img
              src={item.photo.image.publicUrlTransformed}
              alt={item.name}
              width="50"
            />
            {item.name}
          </DropDownItem>
        ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>Sorry, No items found for {inputValue}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
