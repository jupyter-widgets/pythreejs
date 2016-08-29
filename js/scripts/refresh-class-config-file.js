
function refreshClassConfigFile() {
    
    return new Promise(function(resolve, reject) {

    });

}

if (require.main === module) {
    refreshClassConfigFile().then(function() {
        console.log('DONE');
    }).catch(function(err) {
        console.log('ERROR: ' + err);
    })
}
