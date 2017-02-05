const https = require('https')
const XmlStream = require('xml-stream')
const moment = require('moment')
const anitomy = require('anitomyjs')

const request = https.get({
  host: 'www.nyaa.se',
  path: '/?page=rss&cats=1_37&filter=2'
}).on('response', function(response) {
  response.setEncoding('utf8')
  const xml = new XmlStream(response)

  xml.on('updateElement: item', function(item) {
    item.title = anitomy.parseSync(item.title)
    item.pubDate = moment(item.pubDate, 'ddd, DD MMM YYYY HH:mm:ss Z')
  })

  xml.on('endElement: item', function(item) {
    console.log(item.title.ReleaseGroup + ' released ' + item.title.AnimeTitle 
                + ' #' + item.title.EpisodeNumber + ' [' 
                + item.title.VideoResolution + '] @ ' 
                + item.pubDate.format('MMM Do YYYY, h:mm:ss a'))
  })
})
