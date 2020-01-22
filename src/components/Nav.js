import React, { Component } from 'react';
import { Icon, Slider } from 'antd';

class Nav extends Component {

    render() {
          
        return (
            
            <ul className='nav-ul'>
                    <ul className='nav-ul-top'>
                        <Icon type="font-colors" style={{ fontSize: '45px', padding:'5px' }} />
                        <Icon type="line" />
                    </ul>
                    
                    <div className='nav-ul-bottom'>
                        <span className='hard'>Hard</span>
                        <Slider vertical defaultValue={40} className='slider'/>
                        <span className='easy'>Easy</span>
                        <div className='div-space'></div>
                    </div>
            </ul>
            
        );
    }
}

export default Nav;