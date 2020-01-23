import React, { Component } from 'react';

class ArticleTitle extends Component {
    render() {
        console.log(this.props.data)
        return (
                <h1 className='article-title'>{this.props.data[this.props.data.length-1]}</h1>
        );
    }
}

export default ArticleTitle;