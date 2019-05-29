var orm = (function(){
    var module = {};

    var db = firebase.firestore();
    
    var MAX_TRIES = 5;

    // add some retries after fail
    module.increment = function(key) {
        var n_try = 0;

        return make_try(key);

        function make_try(key) {
            console.log("n_try " + n_try);
            n_try++;
            var doc_ref = db.collection("stats").doc("" + key);

            doc_ref.get().then(function(doc){
                var new_obj = {};
                new_obj['count'] = doc.data()['count'] + 1;
                doc_ref.update(new_obj);
            })
                .then(function(){console.log("Increment succeded")})
                .catch(function(err){
                    console.log("Increment failed");
                    if (n_try < MAX_TRIES) return make_try(key);
                });
        }
    };

    module.getAll = function(cb) {
        db.collection("questions").get().then(function(querySnapshot){
            var result = [];

            querySnapshot.forEach(function(doc){
                var data = doc.data();
                result.push({id: +doc.id, count: +data.count});
            });

            result.sort(function(a,b){return a.id - b.id});
            return cb(null, result);
        });
    };

    return module;
})();