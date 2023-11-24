import { useStateProvider } from '@/context/StateContext';
import { reducerCase } from '@/context/constants';
import { BiSearchAlt2 } from 'react-icons/bi';
import { BsFilter } from 'react-icons/bs';

function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvider();
  return (
    <div className="flex bg-search-input-container-background py-3 px-5 gap-2 items-center h-14">
      <div className="flex items-center gap-5 bg-panel-header-background px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
        </div>
        <div className='w-full'>
          <input type="text" placeholder='Search or start a new chat...' className='text-sm bg-transparent focus:outline-none text-white w-full' value={contactSearch} onChange={(e) => dispatch({ type: reducerCase.SET_CONTACT_SEARCH, contactSearch: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
