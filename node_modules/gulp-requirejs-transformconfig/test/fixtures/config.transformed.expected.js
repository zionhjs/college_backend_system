require.config({
    waitSeconds: 0,
    paths: {
        jquery: 'libs/jquery/jquery'
    },
    map: {
        '*': {
            'foo-module': 'bar-module'
        }
    }
});
