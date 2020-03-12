
import React, { Component } from 'react';
import ArticleTitle from './ArticleTitle';
import ArticleContent from './ArticleContent';

class ArticleRender extends Component {
    render() {
        return (
            <div className='content-container'>
                <ArticleTitle />
                <ArticleContent/>
            </div>
        );
    }
}

export default ArticleRender;