const express = require('express');
const morgan = require("morgan");
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const { JSDOM } = require('jsdom');
// Create Express Server
const app = express();

// Configuration
const PORT = 3000;
const HOST = "localhost";
const API_SERVICE_URL = "https://www.jet5.com";
// Logging
app.use(morgan('dev'));



const proxy = createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  /**
   * IMPORTANT: avoid res.end being called automatically
   **/
  selfHandleResponse: true, // res.end() will be called internally by responseInterceptor()

  /**
   * Intercept response and replace 'Hello' with 'Goodbye'
   **/
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    const response = responseBuffer.toString('utf8'); // convert buffer to string
    const dom = new JSDOM(response)
    const regex = /day=([0-9]*)/.exec(req.query)
    console.log(req.query)
    if (req.query.day) {
      const newDay = Number(req.query.day) - (3600 * 24 * 7)
      if (newDay > 1627912971) {
        const scriptelement = dom.window.document.createElement('script')
        scriptelement.innerHTML = `window.setTimeout(()=>window.location.href='?day=${newDay}',500)
    `
        dom.window.document.body.appendChild(scriptelement)
      }
    }
    //console.log(new Set(Array.from(dom.window.document.querySelectorAll('.weektable tr')[2].querySelectorAll('td'), (e) => e.innerText)))
    try {
      console.log(JSON.stringify(Array.from(function* () {
        const weektableRows = dom.window.document.querySelectorAll('.weektable tr')
        checkingRows: for (row of weektableRows) {
          const cells = Array.from(row.querySelectorAll('td'))
          if (cells.length != 22) continue
          
          const theatre = cells.shift()
          const days={}
          ['M', 'Tu', 'W', 'Th', 'F', 'Sa', 'Su'][d],
            people: /(1?[0-9]-1[0-9])(.+)\n(.+)\n/
              .exec(people.slice(d * 3 + 1, d * 3 + 4).join(''))
          })).filter(d=>d.people!="")
          if (days.length>0) yield [theatre,days]
          }
        }()),true,1))
      }
    
    catch {

    }
    return dom.serialize()
  }),
});

// Proxy endpoints
app.use('/', proxy);
// Start the Proxy
app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`);
});
