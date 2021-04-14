const express = require('express');
const app = new express();

const dotenv =require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key =process.env.API_KEY;
    let api_url =process.env.API_URL;
    
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    let params = {
        'url': req.query.url,
        'features': {
            'emotion': {
            
            }
        }
    }
    let naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(params)
      .then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        return res.send(analysisResults.result.emotion.document.emotion);
      })
      .catch(err => {
        console.log('error:', err);
        return res.send(err);
      });
});

app.get("/url/sentiment", (req,res) => {
    let params = {
        'url': req.query.url,
        'features': {
            'sentiment': {
            
            }
        }
    }
    let naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(params)
      .then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        //return res.send(analysisResults.result.sentiment.document);
        let output =analysisResults.result.sentiment.document;
        return res.send({text:"url sentiment for "+req.query.url +' is ' +output.label +', score:' +output.score, label:output.label});
      })
      .catch(err => {
        console.log('error:', err);
        return res.send(err);
      });
});

app.get("/text/emotion", (req,res) => {
    let params = {
        'text': req.query.text,
        'features': {
            'emotion': {
            
            }
        }
    }
    let naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(params)
      .then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        return res.send(analysisResults.result.emotion.document.emotion);
      })
      .catch(err => {
        console.log('error:', err);
        return res.send(err);
      });
    //return res.send({"happy":"10","sad":"90"});
});

app.get("/text/sentiment", (req,res) => {
    let params = {
        'text': req.query.text,
        'features': {
            'sentiment': {
            
            }
        }
    }
    let naturalLanguageUnderstanding = getNLUInstance();
    naturalLanguageUnderstanding.analyze(params)
      .then(analysisResults => {
        //console.log(JSON.stringify(analysisResults, null, 2));
        //return res.send(analysisResults.result.sentiment.document);
        let output =analysisResults.result.sentiment.document;
        return res.send({text:"text sentiment for "+req.query.text +' is ' +output.label +', score:' +output.score, label:output.label});
      })
      .catch(err => {
        console.log('error:', err);
        return res.send(err);
      });
    //return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

