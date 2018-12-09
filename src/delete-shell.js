const js2xmlparser = require('js2xmlparser');
let winrm_soap_req = require('./base-request.js');
let winrm_http_req = require('./http.js');

function constructDeleteShellRequest(_params) {
    var res = winrm_soap_req.getSoapHeaderRequest({
        "resource_uri": "http://schemas.microsoft.com/wbem/wsman/1/windows/shell/cmd",
        "action": "http://schemas.xmlsoap.org/ws/2004/09/transfer/Delete"
    });

    res['s:Header']['wsman:SelectorSet'] = [];
    res['s:Header']['wsman:SelectorSet'].push({
        "wsman:Selector": [{
            "@": {
                "Name": "ShellId"
            },
            "#": _params.shellId
        }]
    });
    res['s:Body'] = {};
    return js2xmlparser.parse('s:Envelope', res);

}

module.exports.doDeleteShell = async function (_params) {
    var req = constructDeleteShellRequest(_params);

    var result = await winrm_http_req.sendHttp(req, _params.host, _params.port, _params.path, _params.auth);

    if (result['s:Envelope']['s:Body'][0]['s:Fault']) {
        return new Error(result['s:Envelope']['s:Body'][0]['s:Fault'][0]['s:Code'][0]['s:Subcode'][0]['s:Value'][0]);
    } else {
        //var output = result['s:Envelope']['s:Body'][0]['rsp:ReceiveResponse'][0]['rsp:Stream'];
        return 'success';
    }
}