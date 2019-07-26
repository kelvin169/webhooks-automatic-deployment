
var http = require('http');
var { exec, spawn } = require('child_process'),
// fs = require('fs'),
LOG = __dirname + '/log',
// SCRIPT = 'sh ' + __dirname + '/deploy.sh';
SCRIPT = 'deploy.sh';

// fs.openSync(LOG, 'a');

http.createServer(function(req, res) {

    /**
     * Setup a webhook on any git service (Github, Bitbucket etc) that makes a post request to the server initiating repo pull
     *  Use ngrok for testing on localhost
     */
    if (req.url === '/deploy') {

        console.log('web hook push', req.url);
        

        //// if logging is needed
        // // exec([SCRIPT, '>>', LOG, '2>&1'].join(' '));
        // exec('sh ' + SCRIPT, (err, stdout, stderr) => {
        //     if (err) {
        //     console.error(err)
        //     } else {
        //     // the *entire* stdout and stderr (buffered)
        //     console.log(`stdout: ${stdout}`);
        //     console.log(`stderr: ${stderr}`);
        //     }
        // });

        //stream ouput unlike exec which buffers
        const process = spawn('sh', [SCRIPT]);
        process.stdout.on('data', (data)=>{
            console.log(data.toString('utf8'));
        });
        process.stderr.on('data', (data)=>{
            console.log(data.toString('utf8'));
        });
        process.on('error', err => console.error(err));        
        // process.on('exit', (code, signal) =>{
        //     console.log('Deployment Exited', `code ${code}`, signal);
        // })

        res.writeHead(200);
        res.end('Okay');
        return;
    }
    console.log('web hook push', req.url);

    res.writeHead(405);
    res.end('Unknown Method');

})
.on('listening', () =>{
    console.log('Server listening');
})
.on('error', (err)=>{
    console.log('Error occurred', err);
})
.listen(2500);
