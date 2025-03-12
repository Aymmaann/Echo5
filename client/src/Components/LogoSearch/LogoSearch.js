import React from 'react'
import './LogoSearch.css'
import Logo from '../../Img/logo.png';
import SearchIcon from '@mui/icons-material/Search';

const LogoSearch = () => {
  return (
    <div className='LogoSearch'>

      <div style={{ display: 'flex-col' }}>
        <img src={Logo} style={{ width: '130px' }} alt="" />

        <div className="Search">
          <input type="text" placeholder='#Search' />

          <div className="s-icon">
            <SearchIcon />
          </div>
        </div>
      </div>

    </div>
  )
}

export default LogoSearch
