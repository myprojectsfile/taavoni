export default {
    "Routes": [
        {
            "routeUrl": "/",
            "signInRequired": "false",
            "claims": []
        },
        {
            "routeUrl": "/profile",
            "signInRequired": "true",
            "claims": []
        },
        {
            "routeUrl": "/queue",
            "signInRequired": "true",
            "claims": ["shareholder"]
        },
        {
            "routeUrl": "/requests",
            "signInRequired": "true",
            "claims": ["shareholder"]
        },
        {
            "routeUrl": "/queueAdmin",
            "signInRequired": "true",
            "claims": ["shareholder"]
        },
        {
            "routeUrl": "/trades",
            "signInRequired": "true",
            "claims": ["shareholder"]
        },
        {
            "routeUrl": "/portfo",
            "signInRequired": "true",
            "claims": ["shareholder"]
        }
    ]
}