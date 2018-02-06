//create mapping
curl --header "Content-Type:application/json" -XPUT localhost:9200/movies -d '
{
    "mappings": {
        "movie": {
            "_all": {"enabled": false},
            "properties": {
                "year": {
                "type": "date"
                }
            }
        }
    }
}'

//another way
curl --header "Content-Type:application/json" -XPUT 127.0.0.1:9200/movies -d '
{
    "mappings": {
        "movie": {
            "_all": {"enabled": false},
            "properties": {
                "id": {"type": "integer"},
                "year": {"type": "date"},
                "genre" : {"type": "text", "index" : "false" },
                "title" : {"type": "text", "analyzer": "english"}
            }
        }
    }
}'
//search
curl -XGET 127.0.0.1:9200/movies/_mapping/movie?pretty
curl -XGET 127.0.0.1:9200/movies/_mapping/movie/_search?pretty
//bulk_load
curl -XPUT --header "Content-Type:application/json" 127.0.0.1:9200/_bulk?pretty --data-binary @movies.json
curl -XGET 127.0.0.1:9200/movies/_search?pretty
//update
curl -XPOST  --header "Content-Type:application/json" 127.0.0.1:9200/movies/movie/_update -d {}
//delete
curl -XDELETE 127.0.0.1:9200/movies/movie/58559?pretty
//search by query
curl -XGET  --header "Content-Type:application/json" 127.0.0.1:9200/movies/movie/_search?pretty -d '
{
    "query" : {
        "match" : {
            "title" : "star trek"
        }
    }
}
curl -XGET  --header "Content-Type:application/json" 127.0.0.1:9200/movies/movie/_search?pretty -d '
{
    "query": {
        "bool": {
            "must": {"term": {"title": "trek"}},
            "filter": {"range": {"year": {"gte": 2010}}}
        }
    }
}
//delete mapping
curl -XDELETE 127.0.0.1:9200/movies
curl -XGET  "127.0.0.1:9200/movies/movie/_search?q=title:star&pretty"
curl -XGET  "127.0.0.1:9200/movies/movie/_search?q=+year:>1980+title:starwars&pretty"
//same query in 3 different ways
curl -XGET  "127.0.0.1:9200/movies/movie/_search?q=%2Byear%3A%3E1980+%2Btitle%3Astar%20wars&pretty"
curl -XGET  --header "Content-Type:application/json" 127.0.0.1:9200/movies/movie/_search?pretty -d '
{
    "query": {
        "bool": {
            "must": {"match_phrase": {"title": "Star Wars"}},
            "filter": {"range": {"year": {"gt": 1980}}}
        }
    }
}'
//pagination
curl -XGET  --header "Content-Type:application/json" '127.0.0.1:9200/movies/movie/_search?size=3&from=2&pretty'
//sort
//if it is a text field we need to create a raw type
curl -XGET  --header Content-Type:application/json '127.0.0.1:9200/movies/movie/_search?sort=year&pretty'
curl -XGET 127.0.0.1:9200/_cat/indices?v
curl  -XGET 127.0.0.1:9200/spark/_search?pretty
curl  -XGET 127.0.0.1:9200/spark?pretty

curl  -XGET --header "Content-Type:application/json"  '127.0.0.1:9200/ratings/rating/_search?size=0&pretty' -d '
{
    "aggs": {
        "ratings": {
            "terms" : {
                "field": "rating"
            }
        }
    }
}'

curl  -XGET --header "Content-Type:application/json" '127.0.0.1:9200/ratings/rating/_search?size=0&pretty' -d '
{
    "query": {
        "match_phrase": { "title": "Star Wars" }
    },
    "aggs": {
        "avg_rating" : {
            "avg": {"field": "rating"}
        }
    }
}'

