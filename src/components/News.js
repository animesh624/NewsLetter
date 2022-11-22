import React, {useEffect, useState} from 'react'

import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
// this.setState() is used to change state in class based component
const News = (props)=>{
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
    
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    } 

    const updateNews = async ()=> {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;   
        // This url will be used to fecth the news
        setLoading(true)
        let data = await fetch(url);  // Using this we have fetched data from 
        // Fetch Api takes url and return promise
        // async await means that aap isko async krrde aur fetch jo promise return krra uske liye wait kree i.e, async function apne body ke andar wait krr skta h kucch promise ko resolve hone ke liye
        props.setProgress(30);
        let parsedData = await data.json()
        // Now this parsed data contain all the information obtained from the newsapi in the form of json whose sample is saved on sampleOutput.json in this system
        props.setProgress(70);
        setArticles(parsedData.articles)
        setTotalResults(parsedData.totalResults)
        setLoading(false)
        props.setProgress(100);
    }

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsLetter`;
        updateNews(); 
        // eslint-disable-next-line
    }, [])


    const fetchMoreData = async () => {   
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
        setPage(page+1) 
        let data = await fetch(url);
        let parsedData = await data.json()
        
        setArticles(articles.concat(parsedData.articles))
        setTotalResults(parsedData.totalResults)
      };
 
        return (
            <>
                <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsLetter - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
                {loading && <Spinner />}  
                {/* This means if loading is true then only add spinner component */}
                <InfiniteScroll
                    dataLength={articles.length}
                    next={fetchMoreData}
                    hasMore={articles.length !== totalResults}
                    loader={<Spinner/>}
                > 
                    <div className="container">
                         
                    <div className="row">
                        {articles.map((element) => {
                            return <div className="col-md-4" key={element.url}>
                                {/* Key:While traversing the elements using map we have to give unique key to each element.In our article part the unique element is the url. */}
                                {/* col-md-4 means that medium devices mee 4 column ki width lelegi.(12 coulumn ki width hoti h bootstrap me) */}
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                {/* ? is used in order to check whether that is null or not..Because slice will give error with null */}
                            </div>
                        })}
                    </div>
                    </div> 
                </InfiniteScroll>
            </>
        )
    
}


News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
}

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
}

export default News
//Now in this also props are read only so props cannot be changed.
// Now initially if we want to define state then we can call this.state inside constructor and main use of state is that state can be changed