import React, { Component } from 'react';

class ArticleContent extends Component {
    render() {
        console.log(this.props.data)
        return (

            <div id='article-content'>
                {this.props.data.map(word => {
                    return (
                        <span className='word-ul'>
                            <span className="word"> {word.word} </span>
                            <span className='translatedWord'> {word.translatedWord}</span>
                        </span>
                    )
                })
                }
            </div>
        )
    }
}

export default ArticleContent;