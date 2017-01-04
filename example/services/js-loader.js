module.exports = {
    load: function(src) {
        return new Promise(function(resolve, reject) {
            var script = document.createElement('script');
            script.src = src;

            script.onload = function() {
                resolve();
            };

            document.querySelector('head').appendChild(script);
        });
    }
};
